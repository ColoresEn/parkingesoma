"use client";

import { updateUser } from "@/actions/user-action";
import React, { ChangeEvent, FormEvent, useState } from "react";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import Input from "./input/Input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      await updateUser(state);
      toast({ description: "User updated." });
      router.push("/admin/users");
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
    <div className="container  mt-5 md:rounded-2xl  shadow-md shadow-black -inset-40 w-full sm:max-w-fit md:max-w-fit  mx-auto border border-[#121212] ">
      <h1 className=" text-center text-2xl">Edit user</h1>

      <form onSubmit={onSubmit}>
       
          <div className=" text-left  ">
            <Label htmlFor="name" className=" m-1 ">
              <h5> Change avatar:</h5>
            </Label>
            <ImageUpload
              value={state.image as string}
              onChange={(value) => setCustomValue("image", value)}
            />
          </div>
          <div className=" text-left text-black">
            <Label htmlFor="name" className=" m-1">
              <h5>Change name:</h5>
            </Label>
            <Input
              placeholder="Name"
              id="name"
              type="text"
              value={state.name}
              name="name"
              onChange={handleChange}
            />
            <Label htmlFor="email" className=" m-1">
              <h5>Change Email:</h5>
            </Label>
            <Input
              placeholder="Email"
              id="email"
              type="text"
              value={state.email}
              name="email"
              onChange={handleChange}
            />
            <div></div>
            <div className="flex justify-end text-left p-2 ">
              <Button
                type="submit"
                className=" uppercase text-sky-300 hover:text-white"
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        
      </form>
    </div>
  );
}
