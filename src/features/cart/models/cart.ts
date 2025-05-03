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
  observation?: string;
  companyId: string;
  companySlug: string;
  companyName: string;

  // Campos para variação
  hasVariation?: boolean;
  variationId?: string;
  variationName?: string;
  variationDescription?: string;

  // Campos para produtos customizados
  isCustomProduct?: boolean;
  customProductSteps?: Array<{
    stepNumber: number;
    stepName?: string;
    selectedItems: Array<{
      id: string;
      name: string;
      price?: number;
    }>;
  }>;

  // Campos para adicionais
  isAddon?: boolean;
  parentItemId?: string;
  addons?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    parentItemId?: string;
  }>;
}

export interface Cart {
  items: CartItem[];
  companyId?: string;
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
