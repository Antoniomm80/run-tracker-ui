import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsSplitLayout } from "@/hooks/use-media-query"

interface ResponsiveSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  /** "tall" fills the screen on phones (maps); "auto" fits its content (forms). */
  size?: "auto" | "tall"
  /** Show an icon close button in the header (forms close with their own Cancel button). */
  showClose?: boolean
}

/**
 * Bottom drawer with a grab handle on phones, centered dialog from the `md`
 * breakpoint up. Built on Radix Dialog, so focus trapping, Escape and
 * scroll locking come for free.
 */
function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "auto",
  showClose = false,
}: ResponsiveSheetProps) {
  const isDialog = useIsSplitLayout()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-stone-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 flex flex-col gap-[18px] bg-card text-card-foreground shadow-xl focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            isDialog
              ? "left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-6 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              : "inset-x-0 bottom-0 overflow-y-auto rounded-t-[28px] px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-2.5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            !isDialog && (size === "tall" ? "top-10" : "max-h-[92dvh]"),
            isDialog && size === "tall" && "h-[80dvh] max-w-[720px]",
          )}
        >
          {!isDialog && <div aria-hidden className="mx-auto h-[5px] w-10 shrink-0 rounded-full bg-bar" />}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <DialogPrimitive.Title className="font-display text-2xl font-extrabold">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-[13px] text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
              )}
            </div>
            {showClose && (
              <DialogPrimitive.Close
                aria-label="Cerrar"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-card transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-[18px]" aria-hidden />
              </DialogPrimitive.Close>
            )}
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { ResponsiveSheet }
