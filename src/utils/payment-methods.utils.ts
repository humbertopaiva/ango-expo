// Path: src/utils/payment-methods.utils.ts
import {
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  CreditCardIcon,
  HandCoins,
} from "lucide-react-native";

/**
 * Interface para formas de pagamento
 */
export interface PaymentMethod {
  type: string; // chave original do backend
  label: string; // nome amigável para exibição
  icon: any; // componente de ícone para representar visualmente
  color: string; // cor associada ao método
}

/**
 * Mapeamento dos tipos de pagamento para exibição amigável
 */
export const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  dinheiro: {
    type: "dinheiro",
    label: "Dinheiro",
    icon: Banknote,
    color: "#22C55E", // verde
  },
  pix: {
    type: "pix",
    label: "Pix",
    icon: QrCode,
    color: "#4338CA", // roxo
  },
  cartao_credito: {
    type: "cartao_credito",
    label: "Cartão de Crédito",
    icon: CreditCard,
    color: "#0284C7", // azul
  },
  cartao_debito: {
    type: "cartao_debito",
    label: "Cartão de Débito",
    icon: CreditCardIcon,
    color: "#10B981", // verde
  },
  transferencia: {
    type: "transferencia",
    label: "Transferência",
    icon: HandCoins,
    color: "#6366F1", // indigo
  },
  boleto: {
    type: "boleto",
    label: "Boleto",
    icon: Receipt,
    color: "#F59E0B", // amarelo
  },
};

/**
 * Obtém um método de pagamento pelo tipo, ou retorna um método padrão caso não exista
 */
export function getPaymentMethod(type: string): PaymentMethod {
  return (
    PAYMENT_METHODS[type] || {
      type,
      label: formatPaymentType(type),
      icon: CreditCard,
      color: "#6B7280", // cinza para métodos desconhecidos
    }
  );
}

/**
 * Formata um tipo de pagamento para exibição amigável
 * Ex: "cartao_credito" -> "Cartão de Crédito"
 */
export function formatPaymentType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
