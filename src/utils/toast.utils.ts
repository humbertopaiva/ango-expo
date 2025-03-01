// src/utils/toast.utils.ts
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/common/toast-helper";
import { useToast } from "@gluestack-ui/themed";

/**
 * Toast utility functions
 *
 * Este módulo fornece uma maneira mais fácil de usar os toasts em toda a aplicação.
 * Ele reexporta as funções do componente simplificado de toast.
 *
 * Exemplo de uso:
 *
 * ```tsx
 * import { useToast } from "@gluestack-ui/themed";
 * import { toastUtils } from "@/src/utils/toast.utils";
 *
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleSave = () => {
 *     // Seu código...
 *     toastUtils.success(toast, "Dados salvos com sucesso!");
 *   };
 * }
 * ```
 */
export const toastUtils = {
  /**
   * Exibe um toast de sucesso
   */
  success: (toast: ReturnType<typeof useToast>, message: string) => {
    showSuccessToast(toast, message);
  },

  /**
   * Exibe um toast de erro
   */
  error: (toast: ReturnType<typeof useToast>, message: string) => {
    showErrorToast(toast, message);
  },

  /**
   * Exibe um toast de aviso
   */
  warning: (toast: ReturnType<typeof useToast>, message: string) => {
    showWarningToast(toast, message);
  },

  /**
   * Exibe um toast informativo
   */
  info: (toast: ReturnType<typeof useToast>, message: string) => {
    showInfoToast(toast, message);
  },
};
