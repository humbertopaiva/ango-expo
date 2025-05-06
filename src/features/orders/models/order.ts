// Path: src/features/orders/models/order.ts

import { CartItem } from "@/src/features/cart/models/cart";

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PIX = "pix",
  CASH = "cash",
}

export interface OrderItem extends CartItem {}

export interface OrderDeliveryInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  deliveryInstructions?: string;
  contactPhone: string;
}

export interface OrderPaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  paymentDate?: Date;
}

export interface Order {
  id: string;
  companyId: string;
  companySlug: string;
  companyName: string;
  companyPhone?: string; // Adicionando telefone da empresa para contato
  customerName: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  subtotal: number;
  deliveryFee?: number;
  total: number;
  payment: OrderPaymentInfo;
  delivery?: OrderDeliveryInfo;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: number; // Em minutos
}

export interface OrderSummary {
  id: string;
  companyName: string;
  total: number;
  createdAt: Date;
  itemCount: number;
}

/**
 * Cria um novo pedido a partir dos itens do carrinho
 */
export function createOrderFromCart(
  cartItems: CartItem[],
  companyId: string,
  companySlug: string,
  companyName: string,
  companyPhone?: string
): Order {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const currentDate = new Date();

  // Gera um ID baseado na data atual sem aleatoriedade
  // Usamos a data formatada como YYYYMMDDHHmmss para garantir sequência cronológica
  const timestamp =
    currentDate.getFullYear() +
    String(currentDate.getMonth() + 1).padStart(2, "0") +
    String(currentDate.getDate()).padStart(2, "0") +
    String(currentDate.getHours()).padStart(2, "0") +
    String(currentDate.getMinutes()).padStart(2, "0") +
    String(currentDate.getSeconds()).padStart(2, "0");

  const orderId = `order_${timestamp}`;

  return {
    id: orderId,
    companyId,
    companySlug,
    companyName,
    companyPhone,
    customerName: "Cliente",
    items: [...cartItems],
    subtotal,
    total: subtotal,
    payment: {
      method: PaymentMethod.CREDIT_CARD,
    },
    createdAt: currentDate,
    updatedAt: currentDate,
    estimatedDeliveryTime: 45,
  };
}
