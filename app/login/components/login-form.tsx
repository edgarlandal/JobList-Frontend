"use client";

import { type SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { PasswordField } from "@/components/auth/password-field";

import { login } from "@/service/auth";
import { apiErrorMessage } from "@/lib/api-error";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(apiErrorMessage(error, "Unable to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="text-sm font-medium text-slate-700"
        >
          Username or email
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={loading}
          placeholder="m@example.com"
          required
          className="h-11 rounded-lg border-slate-200 bg-slate-50 px-3 placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-teal-600/15"
        />
      </div>

      <PasswordField autoComplete="current-password" placeholder="Enter your password"
        value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} />

      {error && (
        <p
          role="alert"
          className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-lg bg-teal-700 font-semibold text-white hover:bg-teal-800 focus-visible:ring-teal-600/25"
      >
        {loading ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />{" "}
            Signing in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
