"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/password-field";
import { apiErrorMessage } from "@/lib/api-error";
import { signup } from "@/service/auth";

const inputClass = "h-11 rounded-lg border-slate-200 bg-slate-50 px-3 placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-teal-600/15";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const data = new FormData(event.currentTarget);
    const firstname = String(data.get("firstname") ?? "").trim();
    const lastname = String(data.get("lastname") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!firstname || !lastname) {
      setError("First name and last name are required.");
      return;
    }
    setLoading(true);
    try {
      await signup({ firstname, lastname, email, password });
      setSuccess(true);
    } catch (error: unknown) {
      setError(apiErrorMessage(error, "Unable to create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p role="status" className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-3 text-sm text-teal-800">Your account has been created. You can now log in.</p>
        <Link href="/login" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800">Go to login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
      {[
        { name: "firstname", label: "First name", autoComplete: "given-name", placeholder: "Jane", type: "text" },
        { name: "lastname", label: "Last name", autoComplete: "family-name", placeholder: "Doe", type: "text" },
        { name: "email", label: "Email", autoComplete: "email", placeholder: "jane@example.com", type: "email" },
      ].map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">{field.label}</Label>
          <Input id={field.name} name={field.name} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} required disabled={loading} className={inputClass} />
        </div>
      ))}
      <PasswordField autoComplete="new-password" placeholder="Create a password" disabled={loading}
        minLength={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
        title="Use at least 8 characters, including an uppercase letter, a lowercase letter and a number."
        hint="At least 8 characters, with an uppercase letter, a lowercase letter and a number." />
      {error && <p role="alert" className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-teal-700 font-semibold text-white hover:bg-teal-800 focus-visible:ring-teal-600/25">
        {loading ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> Creating account...</> : "Sign up"}
      </Button>
    </form>
  );
}
