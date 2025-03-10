// Path: src/features/orders/models/order.ts
import { CartItem } from "@/src/features/cart/models/cart";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "delivered"
  | "canceled";

export interface OrderItem
  extends Omit<CartItem, "companyId" | "companySlug" | "companyName"> {
  price: number;
  priceFormatted: string;
}

export interface Order {
  id: string;
  companyId: string;
  companySlug: string;
  companyName: string;
  items: OrderItem[];
  subtotal: number;
  subtotalFormatted: string;
  deliveryFee: number;
  deliveryFeeFormatted: string;
  total: number;
  totalFormatted: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: string;
}

// Helper para criar um novo pedido a partir de um carrinho
export const createOrderFromCart = (
  cartItems: CartItem[],
  companyId: string,
  companySlug: string,
  companyName: string
): Order => {
  // Calcular subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Taxa de entrega (por enquanto fixa)
  const deliveryFee = 5.0;

  // Total do pedido
  const total = subtotal + deliveryFee;

  // Formatação de preços
  const formatPrice = (price: number): string => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Criar itens do pedido
  const orderItems = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    priceFormatted: item.priceFormatted,
    totalPrice: item.totalPrice,
    totalPriceFormatted: item.totalPriceFormatted,
    imageUrl: item.imageUrl,
    description: item.description,
  }));

  // Criar pedido
  return {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    companyId,
    companySlug,
    companyName,
    items: orderItems,
    subtotal,
    subtotalFormatted: formatPrice(subtotal),
    deliveryFee,
    deliveryFeeFormatted: formatPrice(deliveryFee),
    total,
    totalFormatted: formatPrice(total),
    status: "pending", // Status inicial
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
