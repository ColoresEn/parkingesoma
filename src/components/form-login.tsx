"use client";

import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

interface FormLoginProps {
  OAuthAccountNotLinked: boolean;
}

const FormLogin = ({ OAuthAccountNotLinked }: FormLoginProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.refresh();
        router.push("/admin/settings");
      }
    });
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Welcome back</h1>
        <p className="auth-description">Sign in to share a wall or manage your posts.</p>
        {OAuthAccountNotLinked && (
          <p className="form-error" role="alert">
            Sign in with the account you originally used to confirm your identity.
          </p>
        )}
        <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="form-error">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="form-error">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="auth-switch">
            <span>New here?</span>
            <Link href="/register">Create an account</Link>
          </div>
          <button className="auth-submit" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default FormLogin;
