"use client";

import { registerSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { registerAction } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const FormRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await registerAction(values);
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
        <h1>Join the community</h1>
        <p className="auth-description">Create an account to share the places you find.</p>
        <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="form-error">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="form-error">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link href="/login">Sign in</Link>
          </div>
          <button className="auth-submit" type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default FormRegister;
