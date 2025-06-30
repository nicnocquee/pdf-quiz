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
import { signupAction } from "./actions";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as SupportedLanguage;
  const [state, formAction, isPending] = useActionState(
    async (_state: {}, formData: FormData) => {
      setError(null);
      const result = registerSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
      });
      if (!result.success) {
        setError("Invalid email or password");
        return {};
      }
      const res = await signupAction(formData);
      if (res.error) {
        setError(res.error);
        return {};
      }
      router.push(`/${lng}/login`);
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
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create an account with your email and password.
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
                autoComplete="new-password"
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="max-w-md mx-auto mt-4 text-center">
        <Link
          href={`/${lng}/login`}
          className="text-blue-500 dark:text-blue-400 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </>
  );
};

const RegisterPage = RegisterForm;
export default RegisterPage;
