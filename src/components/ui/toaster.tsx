"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div
      data-slot="toast-viewport"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        open,
        onOpenChange,
        variant,
      }) {
        return (
          <div
            key={id}
            role={variant === "destructive" ? "alert" : "status"}
            data-state={open ? "open" : "closed"}
            className={`flex items-start justify-between gap-3 rounded-lg border p-4 shadow-lg data-[state=closed]:hidden ${
              variant === "destructive"
                ? "border-destructive bg-destructive/10 text-destructive"
                : "bg-popover text-popover-foreground"
            }`}
          >
            <div className="grid min-w-0 flex-1 gap-1">
              {title && <div className="text-sm font-medium">{title}</div>}
              {description && <p className="text-sm opacity-80">{description}</p>}
            </div>
            {action}
            <button
              type="button"
              aria-label="Close notification"
              className="shrink-0 rounded p-1 opacity-70 hover:opacity-100"
              onClick={() => onOpenChange?.(false)}
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
