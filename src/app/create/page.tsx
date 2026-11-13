"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

interface PostState {
  name: string;
  imageSrc: string;
  description: string;
  visitUrl: string;
}

const initialState: PostState = {
  name: "",
  imageSrc: "",
  description: "",
  visitUrl: "",
};

export default function CreatePage() {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/murals", state);
      toast.success("Wall shared");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Could not share wall:", error);
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(message ?? "Your post could not be saved. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  return (
    <main className="editor-page">
      <section className="editor-panel">
        <h1>Share a wall</h1>
        <p className="editor-description">
          Add a photo and tell us who made it or where you found it.
        </p>
        <form className="editor-form" onSubmit={onSubmit}>
          <ImageUpload
            value={state.imageSrc}
            onChange={(value) => setState((previous) => ({ ...previous, imageSrc: value }))}
          />
          <div>
            <label htmlFor="name">Artist or tag</label>
            <input
              id="name"
              type="text"
              value={state.name}
              name="name"
              placeholder="Artist, crew or title"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Location or note</label>
            <textarea
              id="description"
              value={state.description}
              name="description"
              placeholder="Where is the wall? What should people know?"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="visitUrl">Artist website or Instagram (optional)</label>
            <input
              id="visitUrl"
              type="url"
              value={state.visitUrl}
              name="visitUrl"
              placeholder="https://instagram.com/artist"
              onChange={handleChange}
              maxLength={2048}
            />
          </div>
          <button className="editor-submit" type="submit" disabled={isLoading || !state.imageSrc}>
            {isLoading ? "Sharing..." : "Share wall"}
          </button>
        </form>
      </section>
    </main>
  );
}
