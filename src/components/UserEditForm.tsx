"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/user-action";
import React, { ChangeEvent, FormEvent, useState } from "react";
import ImageUpload from "./ImageUpload";
import Input from "./input/Input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UserProps {
  name: string;
  email: string;
  image: string;
  userId: string;
}

export default function UserEditForm({
  name,
  email,
  image,
  userId,
}: UserProps) {
  const router = useRouter();
  const session = useSession();
  const [onActive, setOnActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialState = {
    name,
    email,
    image,
    userId,
  };
  const [state, setState] = useState(initialState);
  const { toast } = useToast();
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, [event.target.name]: event.target.value });
  }
  const onSubmit = async (event: FormEvent) => {
    setIsLoading(true);

    event.preventDefault();
    try {
      await updateProfile(state);
      toast({ description: "Profile updated." });
      session.update();
      router.push("/admin/settings");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const setCustomValue = (id: any, value: any) => {
    setState((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  return (
    <div className="md:rounded-2xl px-10 py-6 shadow-input text-right ">
      <Button
        onClick={() => setOnActive(!onActive)}
        className="uppercase   p-6 "
      >edit</Button>

      {onActive && (
        <div className=" text-left mt-4 justify-center max-w-min flex-wrap mx-auto  ">
          <form onSubmit={onSubmit}>
            <p >
              Change avatar:
            </p>

            <ImageUpload
              value={state.image as string}
              onChange={(value) => setCustomValue("image", value)}
            />
          
            <p>
              Change Name:
            </p>
            <Input
              placeholder="Name"
              id="name"
              type="text"
              value={state.name}
              name="name"
              onChange={handleChange}
            />

            <p>
              Change Email:
            </p>
            <Input
              placeholder="Email"
              id="email"
              type="text"
              value={state.email}
              name="email"
              onChange={handleChange}
            />

            <div className="flex justify-between items-center   ">
              <Button
                type="submit"
                className=" uppercase  "
                disabled={isLoading}
              >
                Submit 
              </Button>
              <Button
                type="button"
                onClick={() => setOnActive(!onActive)}
                className=" uppercase  "
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
