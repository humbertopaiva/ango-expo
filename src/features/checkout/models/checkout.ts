// Path: src/features/checkout/models/checkout.ts

import { z } from "zod";
import { CartItem } from "@/src/features/cart/models/cart";

export enum CheckoutDeliveryType {
  DELIVERY = "delivery",
  PICKUP = "pickup",
}

export enum CheckoutPaymentMethod {
  PIX = "pix",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  CASH = "cash",
}

// Schema para validação dos dados básicos (nome e whatsapp)
const basicInfoSchema = z.object({
  fullName: z.string().min(5, "Nome completo é obrigatório"),
  whatsapp: z
    .string()
    .min(11, "Número de WhatsApp inválido")
    .max(15, "Número de WhatsApp inválido"),
});

// Schema adicional para entrega (endereço completo)
const deliveryInfoSchema = z.object({
  address: z.string().min(5, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(3, "Bairro é obrigatório"),
  reference: z.string().optional(),
});

// Schema para validação dos dados pessoais com condicionais baseadas no tipo de entrega
export const personalInfoSchema = z.object({
  fullName: z.string().min(5, "Nome completo é obrigatório"),
  whatsapp: z
    .string()
    .min(11, "Número de WhatsApp inválido")
    .max(15, "Número de WhatsApp inválido"),
  address: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  reference: z.string().optional(),
});

// Schema para validação do método de pagamento
export const paymentMethodSchema = z.object({
  method: z.nativeEnum(CheckoutPaymentMethod),
  change: z.string().optional(), // Troco em caso de pagamento em dinheiro
});

// Tipo derivado do schema para dados pessoais
export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// Tipo derivado do schema para método de pagamento
export type PaymentInfo = z.infer<typeof paymentMethodSchema>;

// Modelo completo do checkout
export interface CheckoutData {
  deliveryType: CheckoutDeliveryType;
  personalInfo: PersonalInfo;
  paymentInfo: PaymentInfo;
  items: CartItem[];
  companyId: string;
  companySlug: string;
  companyName: string;
  subtotal: number;
  total: number;
}

// Modelo inicial vazio para o checkout
export const emptyCheckout: CheckoutData = {
  deliveryType: CheckoutDeliveryType.DELIVERY,
  personalInfo: {
    fullName: "",
    whatsapp: "",
    address: "",
    number: "",
    neighborhood: "",
    reference: "",
  },
  paymentInfo: {
    method: CheckoutPaymentMethod.PIX,
    change: "",
  },
  items: [],
  companyId: "",
  companySlug: "",
  companyName: "",
  subtotal: 0,
  total: 0,
};
