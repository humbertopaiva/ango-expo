// Path: src/features/orders/models/order.model.ts
import { CartItem } from "@/src/features/cart/models/cart";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY_FOR_DELIVERY = "ready_for_delivery",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PIX = "pix",
  CASH = "cash",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

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
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: Date;
}

export interface Order {
  id: string;
  companyId: string;
  companySlug: string;
  companyName: string;
  customerId?: string;
  customerName: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  subtotal: number;
  deliveryFee?: number;
  total: number;
  status: OrderStatus;
  payment: OrderPaymentInfo;
  delivery?: OrderDeliveryInfo;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: number; // Em minutos
}

export interface OrderSummary {
  id: string;
  companyName: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  itemCount: number;
}

export function createOrderFromExisting(existingOrder: Order): Order {
  return {
    id: `order_${Date.now()}`,
    companyId: existingOrder.companyId,
    companySlug: existingOrder.companySlug,
    companyName: existingOrder.companyName,
    customerId: existingOrder.customerId,
    customerName: existingOrder.customerName,
    items: [...existingOrder.items],
    subtotal: existingOrder.subtotal,
    deliveryFee: existingOrder.deliveryFee,
    total: existingOrder.total,
    status: OrderStatus.PENDING,
    payment: {
      method: existingOrder.payment.method,
      status: PaymentStatus.PENDING,
    },
    delivery: existingOrder.delivery
      ? { ...existingOrder.delivery }
      : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDeliveryTime: existingOrder.estimatedDeliveryTime,
  };
}

// Função para gerar a representação resumida de um pedido
export function getOrderSummary(order: Order): OrderSummary {
  return {
    id: order.id,
    companyName: order.companyName,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items.length,
  };
}

/**
 * Cria um novo pedido a partir dos itens do carrinho
 */
export function createOrderFromCart(
  cartItems: CartItem[],
  companyId: string,
  companySlug: string,
  companyName: string
): Order {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    id: `order_${Date.now()}`,
    companyId,
    companySlug,
    companyName,
    customerName: "Cliente", // Em um app real, viria de um serviço de autenticação
    items: [...cartItems],
    subtotal,
    total: subtotal, // Sem taxas adicionais por enquanto
    status: OrderStatus.PENDING,
    payment: {
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDeliveryTime: 45, // 45 minutos de estimativa padrão
  };
}
