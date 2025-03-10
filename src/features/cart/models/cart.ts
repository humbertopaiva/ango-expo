// Path: src/features/cart/models/cart.ts
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  priceFormatted: string;
  totalPrice: number;
  totalPriceFormatted: string;
  imageUrl?: string;
  description?: string;
  companyId: string;
  companySlug: string;
  companyName: string;
}

export interface Cart {
  items: CartItem[];
  companyId?: string; // Apenas um estabelecimento por vez no carrinho
  companySlug?: string;
  companyName?: string;
  subtotal: number;
  subtotalFormatted: string;
  deliveryFee?: number;
  deliveryFeeFormatted?: string;
  total: number;
  totalFormatted: string;
}

// Modelo inicial para o carrinho vazio
export const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  subtotalFormatted: "R$ 0,00",
  total: 0,
  totalFormatted: "R$ 0,00",
};
