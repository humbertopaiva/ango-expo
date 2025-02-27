// src/hooks/use-toast.ts
import { useToastContext } from "@/src/providers/toast-provider";

export function useToast() {
  return useToastContext();
}
