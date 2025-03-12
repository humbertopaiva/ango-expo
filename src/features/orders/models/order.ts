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
