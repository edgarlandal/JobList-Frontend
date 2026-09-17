"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmint = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    const formData = new URLSearchParams();
    formData.set("username", username);
    formData.set("password", password);

    api
      .post("auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        router.push("/dashboard")
      })
      .catch((error) => {
        const detail = error.response?.data?.detail;
        const message = Array.isArray(detail)
          ? detail
              .map((item) => `${item.loc.join(".")} : ${item.msg}`)
              .join("\n")
          : typeof detail === "string"
            ? detail
            : "Unable to sign in";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className=" bg-[#475569] h-full w-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="w-full flex flex-col items-center justify-center">
          <Image src="/img/logo.png" alt="joblist" width={300} height={200} />

          <CardTitle className=" h4">Login</CardTitle>
          <CardDescription>
            Enter your username below to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmint}>
            <div className=" flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  disabled={loading}
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className=" grid gap-2">
                {error && (
                  <p className=" text-danger" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" className={`w-full bg-[#4F46E5]`}>
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <CardAction className="w-full">
            <div className=" flex flex-row justify-center">
              <Label>{"Don't have an account?"}</Label>
              <Button variant="link" className=" text-blue-500">
                Sign up
              </Button>
            </div>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
