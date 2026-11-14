"use client";
import {  LogOut} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/",
      
    });
  };

  return <div onClick={handleClick}>SignOut</div>;
};
export default LogoutButton;
