"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { IContact } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { deleteContact } from "@/actions/contact-action";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  data: IContact;
}

function SingleContact({ data }: ContactProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteContact({ id: data.id });
      toast({ description: "Message deleted." });
    } catch {
      toast({
        variant: "destructive",
        description: "Could not delete this message. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <tr className="align-top transition-colors hover:bg-[var(--paper)]/70">
      <th scope="row" className="px-4 py-4 font-medium">
        <span className="block text-[var(--ink)]">{data.postername}</span>
        <a
          href={`mailto:${data.email}`}
          className="mt-1 block max-w-52 truncate text-xs font-normal text-[var(--blue-deep)] underline-offset-2 hover:underline"
        >
          {data.email}
        </a>
      </th>
      <td className="max-w-48 px-4 py-4 text-[var(--ink)]">{data.topic}</td>
      <td className="max-w-[30rem] px-4 py-4">
        <details className="group">
          <summary className="cursor-pointer list-none text-[var(--muted)] marker:hidden">
            <span className="line-clamp-2">{data.message}</span>
            <span className="mt-1 inline-block text-xs font-semibold text-[var(--blue-deep)] group-open:hidden">
              Read full message
            </span>
            <span className="mt-1 hidden text-xs font-semibold text-[var(--blue-deep)] group-open:inline-block">
              Hide message
            </span>
          </summary>
          <p className="mb-0 mt-2 whitespace-pre-wrap break-words text-[var(--ink)]">
            {data.message}
          </p>
        </details>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-[var(--muted)]">
        <time dateTime={dayjs(data.createdAt).toISOString()}>
          {dayjs(data.createdAt).format("MMM D, YYYY")}
        </time>
      </td>
      <td className="px-4 py-4 text-right">
        <Button
          size="icon"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete message from ${data.postername}`}
        >
          {isDeleting ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <Trash2 />
          )}
        </Button>
      </td>
    </tr>
  );
}

export default SingleContact;
