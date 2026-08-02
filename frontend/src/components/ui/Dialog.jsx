import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-50
      bg-black/40
      backdrop-blur-sm
      data-[state=open]:animate-in
      data-[state=closed]:animate-out
      data-[state=open]:fade-in-0
      data-[state=closed]:fade-out-0
      duration-200"
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-card shadow-elevated",
          // Mobile: bottom sheet bo góc trên. Desktop (sm+): modal căn giữa.
          "inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh] overflow-y-auto",
          "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:w-full sm:max-w-md",
          `
          p-6 pb-8 sm:pb-6
          duration-200
          data-[state=open]:animate-in  
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
          data-[state=open]:zoom-in-95
          data-[state=closed]:zoom-out-95
          `,
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Đóng</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, children }) {
  return <div className={cn("mb-5 pr-6", className)}>{children}</div>;
}

export function DialogTitle({ className, children }) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg font-bold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ className, children }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground mt-1", className)}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogFooter({ className, children }) {
  return (
    <div className={cn("flex items-center justify-end gap-3 mt-6", className)}>
      {children}
    </div>
  );
}
