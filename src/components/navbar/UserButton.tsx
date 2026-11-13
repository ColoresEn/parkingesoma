"use client";
import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

interface UserButtonProps {
  user: User;
}

const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/80 bg-card/70"
            aria-label="Abrir menú de cuenta"
          />
        }
      >
        <Image
          src={user.image || avatarPlaceholder}
          alt=""
          width={36}
          height={36}
          priority
          className="aspect-square rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user.name || "Tu cuenta"}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/admin/settings" />}>
            <Settings />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/admin/todos" />}>
            <ListTodo />
            Mis tareas
          </DropdownMenuItem>
          {user.role === "ADMIN" && ( 
              <>
          
              <DropdownMenuItem render={<Link href="/admin/dashboard" />}>
                <LayoutDashboard />
                Panel de control
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/users" />}>
                <Users />
                Usuarios
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/messages" />}>
                <MessageCircle />
                Mensajes
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
          }}
        >
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
