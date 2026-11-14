"use client";
import React, {  useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/actions/user-action";

interface SettingsPageProps {
  user: User;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();
  const [onActive, setOnActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",  // Añadir el valor predeterminado del email
      image: user.image || "",  // Añadir el valor predeterminado de la imagen
    },
  });

  async function onSubmit(data: UpdateProfileValues) {
    try {
      await updateProfile(data);
      toast({ description: "Profile updated." });
      session.update();
     
    
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <div className="container block  md:rounded-2xl  shadow-input   ">
    <div className="justify-between items-center ">
      <Button
        onClick={() => setOnActive(!onActive)}
        className="uppercase text-white hover:text-violet-500 text-2xl"
      >
        edit 
      </Button>
      {'      '}
 {/*      <Button
        disabled={isLoading}
        className="uppercase text-white hover:text-violet-500"
        onClick={onDelete}
      >
          Delete
      </Button> */}
    </div>

    {onActive && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm space-y-2.5"
          >
            {/* Campo Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Change your public username</FormDescription>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Update your email</FormDescription>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Imagen */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Update your profile picture (URL)</FormDescription>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón Submit */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
  )}
    </div>
  );
}
