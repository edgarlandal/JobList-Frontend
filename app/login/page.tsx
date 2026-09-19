import Image from "next/image";
import { LoginForm } from "./components/login-form";

export default function Login() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 text-slate-900">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)] sm:p-8"
      >
        <header className="mb-7 text-center">
          <Image
            src="/img/logo.png"
            alt="Joblist"
            width={300}
            height={200}
            priority
            loading="eager"
            className="mx-auto mb-4 h-auto w-44"
            style={{ width: "150px", maxWidth: "100%", height: "auto" }}
          />
          <h1 id="login-title" className="text-2xl font-bold tracking-tight">
            Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to your account to continue.
          </p>
        </header>

        <LoginForm />
      </section>
    </main>
  );
}
