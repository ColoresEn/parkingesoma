"use client";

import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  user: User;
}

const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <details className="account-menu">
      <summary className="avatar-trigger" aria-label="Open account menu">
        <Image
          src={user.image || avatarPlaceholder}
          alt=""
          width={42}
          height={42}
          priority
        />
      </summary>
      <nav className="account-menu-content" aria-label="Account">
        <strong>{user.name || "Your account"}</strong>
        <Link href="/admin/settings">Profile</Link>
        <Link href="/admin/todos">Todos</Link>
        <Link href="/create">Share a wall</Link>
        {user.role === "ADMIN" && (
          <>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/messages">Messages</Link>
          </>
        )}
        <button type="button"  onClick={async () => {
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
          }}>Sign out</button>
      </nav>
    </details>
  );
};

export default UserButton;
