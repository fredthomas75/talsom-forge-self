import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { C } from "@/lib/constants";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  dark?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  dark = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={dark ? "bg-gray-950 border-white/10" : ""}>
        <AlertDialogHeader>
          <AlertDialogTitle className={dark ? "text-white" : ""}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={dark ? "text-white/50" : ""}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={`rounded-full ${dark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : ""}`}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-full border-0"
            style={destructive ? { background: "#EF4444", color: "white" } : { background: C.green, color: "white" }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
