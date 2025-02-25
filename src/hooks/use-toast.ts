// src/hooks/use-toast.ts
import { useState, useCallback } from "react";
import { Platform } from "react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastShowParams {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface UseToastReturn {
  toasts: ToastMessage[];
  show: (params: ToastShowParams) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback(
    ({
      title,
      description,
      type = "info",
      duration = 5000,
    }: ToastShowParams) => {
      const id = Math.random().toString(36).substring(2, 9);

      const newToast: ToastMessage = {
        id,
        title,
        description,
        type,
        duration,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Se estiver em ambiente Web, podemos usar a API de notificações nativa
      if (Platform.OS === "web") {
        try {
          // Tenta usar notificações nativas do navegador
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(title, {
              body: description,
            });
          }
        } catch (error) {
          // Ignora erros de notificação
          console.log("Notification API not supported");
        }
      }

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    dismiss,
    dismissAll,
  };
}
