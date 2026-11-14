"use client";

import { useState } from "react";
import type { AdminUserSummary } from "@/actions/getUsers";
import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { deleteUser } from "@/actions/user-action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UserProps {
  data: AdminUserSummary;
}

function SingleUser({ data }: UserProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteUser({ id: data.id });
      toast({ description: "User deleted." });
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        description: "Could not delete this user. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="flex min-w-0 flex-col rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--paper)]">
          <Image
            src={data.image || avatarPlaceholder}
            alt=""
            width={56}
            height={56}
            className="size-14 object-cover"
          />
        </div>
        <div className="min-w-0">
          <h2 className="mb-1 truncate text-lg font-semibold">{data.name}</h2>
          <p className="m-0 truncate text-sm text-[var(--muted)]">
            {data.email || "No email address"}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-4 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Role</dt>
          <dd className="mt-1 font-medium">{data.role.toLowerCase()}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Joined</dt>
          <dd className="mt-1 font-medium">{data.createdAt}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/users/${data.id}`)}
          aria-label={`Edit ${data.name}`}
        >
          <PencilLine />
          Edit user
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${data.name}`}
        >
          {isDeleting ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <Trash2 />
          )}
        </Button>
      </div>
    </article>
  );
}

export default SingleUser;
