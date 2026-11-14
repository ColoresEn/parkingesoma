"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import ImageUpload from "./ImageUpload";
import { toast } from "react-hot-toast";

interface BlogProps {
  name?: string;
  description?: string;
  imageSrc?: string;
  visitUrl?: string | null;
  blogId?: string;
}

interface MuralState {
  name: string;
  description: string;
  imageSrc: string;
  visitUrl: string;
}

export default function BlogId({
  name,
  description,
  imageSrc,
  visitUrl,
  blogId,
}: BlogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<MuralState>({
    name: name ?? "",
    description: description ?? "",
    imageSrc: imageSrc ?? "",
    visitUrl: visitUrl ?? "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!blogId) {
      toast.error("This mural could not be found.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`/api/murals/${blogId}`, state);
      toast.success("Mural updated.");
      router.push(`/murals/${blogId}`);
      router.refresh();
    } catch (error) {
      console.error("Could not update mural:", error);
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(message ?? "The mural could not be updated. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const setImage = (value: string) => {
    setState((previous) => ({ ...previous, imageSrc: value }));
  };

  return (
    <form className="editor-form" onSubmit={onSubmit}>
      <ImageUpload value={state.imageSrc} onChange={setImage} />
      <div>
        <label htmlFor="mural-name">Artist or tag</label>
        <input
          id="mural-name"
          type="text"
          value={state.name}
          name="name"
          placeholder="Artist, crew or title"
          onChange={handleChange}
          maxLength={120}
          required
        />
      </div>
      <div>
        <label htmlFor="mural-description">Location or note</label>
        <textarea
          id="mural-description"
          value={state.description}
          name="description"
          placeholder="Where is the wall? What should people know?"
          onChange={handleChange}
          maxLength={2000}
          required
        />
      </div>
      <div>
        <label htmlFor="mural-visit-url">Artist website or Instagram (optional)</label>
        <input
          id="mural-visit-url"
          type="url"
          value={state.visitUrl}
          name="visitUrl"
          placeholder="https://instagram.com/artist"
          onChange={handleChange}
          maxLength={2048}
        />
      </div>
      <div className="editor-actions">
        <button className="editor-submit" type="submit" disabled={isLoading || !state.imageSrc}>
          {isLoading ? "Saving..." : "Save changes"}
        </button>
        <button
          className="editor-cancel"
          type="button"
          onClick={() => router.push(blogId ? `/murals/${blogId}` : "/murals")}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
