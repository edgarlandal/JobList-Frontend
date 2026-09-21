import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "./components/login-form";

export default function Login() {
  return (
    <AuthCard title="Login" description="Sign in to your account to continue."
      footer="Don?t have an account?" link={{ href: "/signup", label: "Sign up" }}>
      <LoginForm />
    </AuthCard>
  );
}
