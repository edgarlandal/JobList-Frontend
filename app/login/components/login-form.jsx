"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const formData = new URLSearchParams();
    formData.set("username", username);
    formData.set("password", password);

    try {
      await api.post("auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      router.push("/dashboard");
    } catch (error) {
      const detail = error.response?.data?.detail;
      setError(Array.isArray(detail)
        ? detail.map((item) => `${item.loc.join(".")} : ${item.msg}`).join("\n")
        : typeof detail === "string" ? detail : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-slate-700">
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

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            placeholder="Enter your password"
            required
            className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-3 pr-12 placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-teal-600/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-50"
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-lg bg-teal-700 font-semibold text-white hover:bg-teal-800 focus-visible:ring-teal-600/25"
      >
        {loading ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> Signing in...</> : "Login"}
      </Button>
    </form>
  );
}
