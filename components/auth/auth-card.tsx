import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type AuthCardProps = {
  title: string;
  description: string;
  footer: string;
  link: { href: string; label: string };
  children: ReactNode;
};

export function AuthCard({ title, description, footer, link, children }: AuthCardProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-10 text-slate-900">
      <section aria-labelledby="auth-title" className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)] sm:p-8">
        <header className="mb-7 text-center">
          <Image src="/img/logo.png" alt="Joblist" width={300} height={200} priority className="mx-auto mb-4 h-auto w-[150px]" />
          <h1 id="auth-title" className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </header>
        {children}
        <p className="mt-6 text-center text-sm text-slate-500">
          {footer}{" "}
          <Link href={link.href} className="font-semibold text-teal-700 hover:underline">{link.label}</Link>
        </p>
      </section>
    </main>
  );
}
