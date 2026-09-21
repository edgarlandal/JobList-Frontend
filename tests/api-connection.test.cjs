const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Load TypeScript modules with injected I/O; no backend data is modified.
function load(relativePath, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    (name) => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name),
    loadedModule, loadedModule.exports,
  );
  return loadedModule.exports;
}

function server(token) {
  return load("lib/server/api.ts", {
    "server-only": {},
    "next/headers": { cookies: async () => ({ get: () => token ? { value: token } : undefined }) },
  });
}

process.env.FASTAPI_URL = "http://backend.test/api/v1/";
process.env.APP_ORIGIN = "http://frontend.test";

test("DELETE route forwards an authenticated bodyless request and preserves 204", async (t) => {
  t.mock.method(global, "fetch", async (url, options) => {
    assert.equal(url, "http://backend.test/api/v1/jobs/job%2F1");
    assert.equal(options.method, "DELETE");
    assert.equal(options.headers.get("Authorization"), "Bearer token");
    assert.equal(options.body, undefined);
    return new Response(null, { status: 204 });
  });
  const route = load("app/api/jobs/[id]/route.ts", { "@/lib/server/api": server("token") });
  const response = await route.DELETE(new Request("http://frontend.test/api/jobs/job%2F1", {
    method: "DELETE", headers: { origin: "http://frontend.test" },
  }), { params: Promise.resolve({ id: "job/1" }) });
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

test("delete service encodes IDs and propagates failures for partial deletion handling", async () => {
  const service = load("service/jobs.ts", { "@/lib/api": {
    delete: async (url) => {
      if (url === "jobs/failed") throw new Error("Deletion failed");
      assert.equal(url, "jobs/job%2F1");
      return { status: 204 };
    },
  } });
  await service.deleteJob("job/1");
  await assert.rejects(service.deleteJob("failed"), /Deletion failed/);
});

test("jobs proxy forwards pagination and session, and preserves validation errors", async (t) => {
  const validation = { details: [{ field: "salary", message: "Invalid salary" }] };
  t.mock.method(global, "fetch", async (url, options) => {
    assert.equal(url, "http://backend.test/api/v1/jobs?limit=5&offset=10");
    assert.equal(options.headers.get("Authorization"), "Bearer test-token");
    assert.equal(options.cache, "no-store");
    return Response.json(validation, { status: 422 });
  });
  const response = await server("test-token").forwardApi(new Request("http://frontend.test/api/jobs"), "jobs?limit=5&offset=10");
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), validation);
});

test("jobs proxy rejects missing sessions and foreign origins before contacting API", async (t) => {
  const fetchMock = t.mock.method(global, "fetch", () => { throw new Error("Must not fetch"); });
  assert.equal((await server().forwardApi(new Request("http://frontend.test/api/jobs"), "jobs")).status, 401);
  assert.equal((await server("token").forwardApi(new Request("http://frontend.test/api/jobs", {
    method: "POST", headers: { origin: "http://foreign.test" }, body: "{}",
  }), "jobs")).status, 403);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("API connection failures return 502", async (t) => {
  t.mock.method(global, "fetch", async () => { throw new Error("Connection refused"); });
  const response = await server("token").forwardApi(new Request("http://frontend.test/api/jobs"), "jobs");
  assert.equal(response.status, 502);
});

test("login sends the FastAPI form and stores both tokens as HttpOnly cookies", async (t) => {
  t.mock.method(global, "fetch", async (url, options) => {
    assert.equal(url, "http://backend.test/api/v1/auth/login");
    assert.equal(options.headers["Content-Type"], "application/x-www-form-urlencoded");
    assert.equal(options.body.get("username"), "test@example.com");
    assert.equal(options.body.get("password"), "test-password");
    return Response.json({ access_token: "test-access", refresh_token: "test-refresh" });
  });
  const route = load("app/api/auth/login/route.ts", {
    "@/lib/server/api": server(),
    "@/lib/server/cookies": { authCookieOptions: { httpOnly: true, sameSite: "lax", path: "/" } },
  });
  const response = await route.POST(new Request("http://frontend.test/api/auth/login", {
    method: "POST", headers: { origin: "http://frontend.test", "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@example.com", password: "test-password" }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.cookies.get("access_token").value, "test-access");
  assert.equal(response.cookies.get("refresh_token").value, "test-refresh");
  assert.ok(response.headers.getSetCookie().every((cookie) => cookie.includes("HttpOnly")));
});

test("jobs service translates backend status, salary enum and paginated data", async () => {
  const record = { id: "job-1", enterprise: "Acme", role: "Developer", salary: 100,
    type_salary: "Mounthly", mode: "Remote", location: "Tijuana", status_job: "RH",
    last_update_at: "2026-09-20T12:00:00Z", notes: "" };
  const api = {
    get: async (url, options) => {
      assert.equal(url, "jobs");
      assert.deepEqual(options.params, { limit: 5, offset: 10 });
      return { data: { items: [record], total: 11, limit: 5, offset: 10 } };
    },
    post: async (url, body) => {
      assert.equal(url, "jobs");
      assert.equal(body.status_job, "RH");
      assert.equal(body.type_salary, "Mounthly");
      assert.equal(body.status, undefined);
      assert.ok(Number.isFinite(Date.parse(body.last_update_at)));
      return { data: record };
    },
    patch: async (url, body) => {
      assert.equal(url, "jobs/job-1");
      assert.equal(body.status_job, "Job Offer");
      return { data: { ...record, ...body } };
    },
  };
  const service = load("service/jobs.ts", { "@/lib/api": api });
  const page = await service.listJobs(5, 10);
  assert.equal(page.total, 11);
  assert.equal(page.items[0].status, "RH");
  assert.equal(page.items[0].type_salary, "Monthly");
  const { id, last_update_at, ...input } = page.items[0];
  assert.equal(last_update_at, record.last_update_at);
  assert.equal((await service.createJob(input)).id, id);
  assert.equal((await service.updateJob(id, { status: "Job Offer", salary: 100, type_salary: "Monthly", notes: "" })).status, "Job Offer");
});
