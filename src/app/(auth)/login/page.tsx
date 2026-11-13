import { Suspense } from "react";
import FormLogin from "@/components/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) => {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <section className="auth-panel">
            <p role="status">Loading sign-in...</p>
          </section>
        </main>
      }
    >
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
};

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const OAuthAccountNotLinked = error === "OAuthAccountNotLinked";

  return <FormLogin OAuthAccountNotLinked={OAuthAccountNotLinked} />;
}

export default LoginPage;
