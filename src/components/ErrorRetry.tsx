import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { C } from "@/lib/constants";

interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
  dark?: boolean;
}

export function ErrorRetry({ message, onRetry, retryLabel = "Retry", dark = false }: ErrorRetryProps) {
  return (
    <div className={`text-center py-12 px-4 rounded-xl border ${dark ? "border-white/5 bg-gray-900" : "border-red-100 bg-red-50/30"}`}>
      <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-400" />
      <p className={`text-sm mb-4 ${dark ? "text-white/50" : "text-gray-600"}`}>{message}</p>
      <Button onClick={onRetry} variant="outline" className="rounded-full text-sm" style={{ borderColor: C.green, color: C.green }}>
        <RefreshCw className="w-3.5 h-3.5 mr-2" />
        {retryLabel}
      </Button>
    </div>
  );
}
