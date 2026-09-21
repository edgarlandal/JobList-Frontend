import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "./components/signup-form";

export default function Signup() {
  return (
    <AuthCard title="Create an account" description="Sign up to start tracking your job applications."
      footer="Already have an account?" link={{ href: "/login", label: "Login" }}>
      <SignupForm />
    </AuthCard>
  );
}
