import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import getCurrentUser from "@/actions/getCurrentUser";
import UserEditForm from "@/components/UserEditForm";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
          Mi perfil
        </h1>
        <p className="m-0 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Revisa y actualiza la información de tu cuenta.
        </p>
      </header>
      <Suspense fallback={<AdminPageSkeleton label="perfil" />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}

async function ProfileContent() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="space-y-5">
      <section
        aria-labelledby="profile-summary-title"
        className="surface-panel p-5 sm:p-7"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            src={currentUser.image || avatarPlaceholder}
            alt=""
            width={88}
            height={88}
            priority
            className="size-20 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0">
            <h2
              id="profile-summary-title"
              className="m-0 text-xl font-semibold tracking-tight"
            >
              {currentUser.name || "Tu cuenta"}
            </h2>
            <p className="m-0 mt-1 break-all text-sm text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Miembro desde</dt>
            <dd className="m-0 mt-1 font-medium">
              <time dateTime={currentUser.createdAt}>
                {new Intl.DateTimeFormat("es-ES", {
                  dateStyle: "long",
                }).format(new Date(currentUser.createdAt))}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Rol de cuenta</dt>
            <dd className="m-0 mt-1 font-medium">
              {currentUser.role === "ADMIN" ? "Administrador" : "Usuario"}
            </dd>
          </div>
        </dl>
      </section>
      <section
        aria-labelledby="profile-edit-title"
        className="surface-panel p-5 sm:p-7"
      >
        <h2 id="profile-edit-title" className="m-0 text-lg font-semibold">
          Datos del perfil
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Cambia tu nombre, correo o imagen de perfil.
        </p>
        <UserEditForm
          name={currentUser.name || ""}
          image={currentUser.image || ""}
          userId={currentUser.id}
          email={currentUser.email || ""}
        />
      </section>
    </div>
  );
}
