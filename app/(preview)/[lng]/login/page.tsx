"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { startTransition, useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SupportedLanguage } from "@/locales/.generated/types";
import { useActionState } from "react";
import { loginAction } from "./actions";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as SupportedLanguage;
  const [state, formAction, isPending] = useActionState(
    async (_state: {}, formData: FormData) => {
      setError(null);
      const result = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
      });
      if (!result.success) {
        setError("Invalid email or password");
        return {};
      }
      const res = await loginAction(formData);
      if (res.error) {
        setError(res.error);
        return {};
      }
      console.log(res);
      router.push(`/${lng}`);
      return {};
    },
    {}
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };
  return (
    <>
      <Card className="max-w-md mx-auto mt-16">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Sign in with your email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="max-w-md mx-auto mt-4 text-center">
        <Link
          href={`/${lng}/register`}
          className="text-blue-500 dark:text-blue-400 hover:underline">
          Don&apos;t have an account? Register
        </Link>
      </div>
    </>
  );
};

const LoginPage = LoginForm;
export default LoginPage;
