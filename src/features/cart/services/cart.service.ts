// Path: src/features/cart/services/cart.service.ts

import { useMultiCartStore } from "../stores/cart.store";
import {
  CompanyProduct,
  ProductWithVariation,
} from "@/src/features/company-page/models/company-product";
import {
  CustomProductDetail,
  CustomProductSelection,
} from "@/src/features/company-page/models/custom-product";
import { CartItem } from "../models/cart";

export class CartService {
  /**
   * Adiciona um produto simples ao carrinho
   */
  static addSimpleProduct(
    product: CompanyProduct,
    companySlug: string,
    companyName: string,
    quantity: number = 1,
    observation?: string
  ): void {
    const store = useMultiCartStore.getState();

    // Gera um ID único para o item do carrinho
    const itemId = `${product.id}_${Date.now()}`;

    store.addItem(companySlug, {
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity,
      price: parseFloat(product.preco_promocional || product.preco),
      imageUrl: product.imagem || undefined,
      description: product.descricao || undefined,
      observation,
      companyId: product.empresa.slug,
      companySlug,
      companyName,
    });
  }

  /**
   * Adiciona um produto com variação ao carrinho
   */
  static addProductWithVariation(
    product: ProductWithVariation,
    companySlug: string,
    companyName: string,
    quantity: number = 1,
    observation?: string
  ): void {
    const store = useMultiCartStore.getState();

    if (!product.produto_variado) {
      this.addSimpleProduct(
        product,
        companySlug,
        companyName,
        quantity,
        observation
      );
      return;
    }

    // Gera um ID único para o item do carrinho
    const itemId = `${product.id}_${product.produto_variado.id}_${Date.now()}`;

    const price = parseFloat(
      product.produto_variado.preco_promocional ||
        product.produto_variado.preco ||
        product.preco_promocional ||
        product.preco
    );

    store.addItem(companySlug, {
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity,
      price,
      imageUrl: product.produto_variado.imagem || product.imagem || undefined,
      description:
        product.produto_variado.descricao || product.descricao || undefined,
      observation,
      companyId: product.empresa.slug,
      companySlug,
      companyName,
      hasVariation: true,
      variationId: product.produto_variado.id,
      variationName: product.produto_variado.valor_variacao || "Variação",
      variationDescription: product.produto_variado.descricao,
    });
  }

  /**
   * Adiciona um produto customizado ao carrinho
   */
  static addCustomProduct(
    product: CustomProductDetail,
    companySlug: string,
    companyName: string,
    selections: CustomProductSelection[],
    totalPrice: number,
    quantity: number = 1,
    observation?: string
  ): void {
    const store = useMultiCartStore.getState();

    // Gera um ID único para o item do carrinho
    const itemId = `custom_${product.id}_${Date.now()}`;

    // Mapear as seleções para o formato do carrinho
    const customProductSteps = selections.map((step) => ({
      stepNumber: step.stepNumber,
      stepName: product.passos.find((p) => p.passo_numero === step.stepNumber)
        ?.nome,
      selectedItems: step.selectedItems.map((item) => ({
        id: item.produtos.key,
        name: item.produto_detalhes.nome,
        price: item.produto_detalhes.preco
          ? parseFloat(item.produto_detalhes.preco)
          : undefined,
      })),
    }));

    store.addItem(companySlug, {
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity,
      price: totalPrice / quantity, // Preço por unidade
      imageUrl: product.imagem || undefined,
      description: product.descricao || undefined,
      observation,
      companyId: companySlug,
      companySlug,
      companyName,
      isCustomProduct: true,
      customProductSteps,
    });
  }

  /**
   * Adiciona um adicional ao carrinho
   */
  static addAddon(
    addon: CompanyProduct,
    companySlug: string,
    companyName: string,
    parentItemName: string,
    quantity: number = 1
  ): void {
    const store = useMultiCartStore.getState();

    // Gera um ID único para o item adicional
    const itemId = `addon_${addon.id}_${Date.now()}`;
    const price = parseFloat(addon.preco_promocional || addon.preco);

    store.addItem(companySlug, {
      id: itemId,
      productId: addon.id,
      name: addon.nome,
      quantity,
      price,
      imageUrl: addon.imagem || undefined,
      description: `Adicional para: ${parentItemName}`,
      companyId: addon.empresa.slug,
      companySlug,
      companyName,
      addons: [
        {
          id: addon.id,
          name: addon.nome,
          quantity,
          price,
        },
      ],
    });
  }

  static addAddonToCart(
    addon: CompanyProduct,
    companySlug: string,
    companyName: string,
    parentItemId: string, // ID do item principal ao qual este adicional está conectado
    quantity: number = 1,
    parentItemName: string = "item"
  ): void {
    const store = useMultiCartStore.getState();

    // Gera um ID único para o item adicional
    const itemId = `addon_${addon.id}_${Date.now()}`;
    const price = parseFloat(addon.preco_promocional || addon.preco);

    store.addItem(companySlug, {
      id: itemId,
      productId: addon.id,
      name: addon.nome,
      quantity,
      price,
      imageUrl: addon.imagem || undefined,
      description: `Adicional para: ${parentItemName}`,
      companyId: addon.empresa.slug,
      companySlug,
      companyName,
      addons: [
        {
          id: addon.id,
          name: addon.nome,
          quantity,
          price,
          parentItemId, // Armazenar o ID do item principal
        },
      ],
    });
  }
}
