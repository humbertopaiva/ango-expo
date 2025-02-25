// src/providers/toast-provider.tsx
import React, { createContext, useContext } from "react";
import { useToast } from "../hooks/use-toast";
import { Toast, ToastContainer } from "@/components/ui/toast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextValue {
  show: (params: {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
  }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, show, dismiss, dismissAll } = useToast();

  return (
    <ToastContext.Provider value={{ show, dismiss, dismissAll }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onDismiss={dismiss}
            duration={toast.duration}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
