// Path: src/features/checkout/services/cart-processor.service.ts

import { CartItem } from "../../cart/models/cart";
import {
  CheckoutData,
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
} from "../models/checkout";

interface ProcessedCartItems {
  mainItems: CartItem[];
  addons: Record<string, CartItem[]>;
  customItems: CartItem[];
  totalItems: number;
}

/**
 * Serviço para processamento de itens do carrinho durante o checkout
 */
export class CartProcessorService {
  /**
   * Processa os itens do carrinho categorizando-os por tipo
   * @param items Lista de itens do carrinho
   * @returns Objeto com itens categorizados
   */
  static processItems(items: CartItem[]): ProcessedCartItems {
    const mainItems: CartItem[] = [];
    const customItems: CartItem[] = [];
    const addonsMap: Record<string, CartItem[]> = {};
    let totalItems = 0;

    // Primeiro passo: identificar adicionais pelo parentItemId
    items.forEach((item) => {
      if (
        item.isAddon ||
        (item.addons && item.addons.length > 0 && item.addons[0].parentItemId)
      ) {
        // É um adicional
        const parentId =
          item.parentItemId || (item.addons && item.addons[0].parentItemId);

        if (parentId) {
          if (!addonsMap[parentId]) {
            addonsMap[parentId] = [];
          }
          addonsMap[parentId].push(item);
        }
      } else if (item.isCustomProduct) {
        // É um produto customizado
        customItems.push(item);
        totalItems += item.quantity;
      } else {
        // É um item principal (incluindo produtos com variações)
        mainItems.push(item);
        totalItems += item.quantity;
      }
    });

    return { mainItems, addons: addonsMap, customItems, totalItems };
  }

  /**
   * Formatação de itens do carrinho para exibição no resumo de checkout
   * @param items Lista de itens do carrinho
   * @returns Lista formatada para exibição
   */
  static formatItemsForCheckout(items: CartItem[]): any[] {
    const { mainItems, addons, customItems } = this.processItems(items);
    const formattedItems: any[] = [];

    // Processar itens principais com seus adicionais
    mainItems.forEach((item) => {
      const itemAddons = addons[item.id] || [];
      const formattedItem = {
        ...item,
        addons: itemAddons.map((addon) => ({
          name: addon.name,
          quantity: addon.quantity,
          price: addon.price,
          totalPrice: addon.price * addon.quantity,
        })),
      };
      formattedItems.push(formattedItem);
    });

    // Adicionar produtos customizados
    customItems.forEach((item) => {
      formattedItems.push({
        ...item,
        steps: item.customProductSteps || [],
      });
    });

    return formattedItems;
  }

  /**
   * Calcula o total do pedido incluindo todos os tipos de itens
   * @param items Lista de itens do carrinho
   * @returns Valor total do pedido
   */
  static calculateOrderTotal(items: CartItem[]): number {
    const { mainItems, addons, customItems } = this.processItems(items);

    // Soma dos itens principais
    const mainItemsTotal = mainItems.reduce((sum, item) => {
      let itemTotal = item.price * item.quantity;

      // Adicionar preço dos adicionais para este item
      const itemAddons = addons[item.id] || [];
      itemTotal += itemAddons.reduce((addonSum, addon) => {
        return addonSum + addon.price * addon.quantity;
      }, 0);

      return sum + itemTotal;
    }, 0);

    // Soma dos produtos customizados
    const customItemsTotal = customItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return mainItemsTotal + customItemsTotal;
  }

  /**
   * Calcula o total do pedido incluindo todos os tipos de itens e taxa de entrega
   * @param items Lista de itens do carrinho
   * @param isDelivery Se a entrega está selecionada
   * @param deliveryFee Valor da taxa de entrega
   * @returns Valor total do pedido
   */
  static calculateOrderTotalWithDelivery(
    items: CartItem[],
    isDelivery: boolean = true,
    deliveryFee: number = 0
  ): number {
    // Calcular o subtotal dos itens
    const subtotal = this.calculateOrderTotal(items);

    // Adicionar taxa de entrega se o método de entrega for selecionado
    const finalDeliveryFee = isDelivery ? deliveryFee : 0;

    // Retornar o valor total
    return subtotal + finalDeliveryFee;
  }

  /**
   * Formata os itens para a mensagem de WhatsApp no checkout
   * @param checkoutData Dados do checkout
   * @returns Mensagem formatada
   */
  static formatWhatsAppMessage(checkoutData: CheckoutData): string {
    const {
      items,
      personalInfo,
      paymentInfo,
      deliveryType,
      companyName,
      total,
      subtotal,
      deliveryFee,
    } = checkoutData;

    // Processar os itens em categorias
    const { mainItems, addons, customItems } = this.processItems(items);

    // Cabeçalho
    let message = `*NOVO PEDIDO - ${companyName}*\n\n`;

    // Tipo de entrega
    message += `*Tipo de entrega:* ${
      deliveryType === CheckoutDeliveryType.DELIVERY
        ? "Entrega"
        : "Retirada no local"
    }\n\n`;

    // Dados do cliente
    message += `*DADOS DO CLIENTE:*\n`;
    message += `Nome: ${personalInfo.fullName}\n`;
    message += `WhatsApp: ${personalInfo.whatsapp}\n`;

    // Endereço (se for entrega)
    if (deliveryType === CheckoutDeliveryType.DELIVERY) {
      message += `\n*ENDEREÇO DE ENTREGA:*\n`;
      message += `${personalInfo.address}, ${personalInfo.number}\n`;
      message += `Bairro: ${personalInfo.neighborhood}\n`;
      message += `Cidade: Lima Duarte (MG)\n`;

      if (personalInfo.reference) {
        message += `Ponto de referência: ${personalInfo.reference}\n`;
      }
    }

    // Itens do pedido
    message += `\n*ITENS DO PEDIDO:*\n`;

    // Processar itens principais com seus adicionais
    mainItems.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.name}`;

      // Adicionar informação de variação, se houver
      if (item.hasVariation && item.variationName) {
        message += ` (${item.variationName})`;
      }

      message += ` - ${item.totalPriceFormatted}\n`;

      // Adicionar adicionais, se houver
      const itemAddons = addons[item.id] || [];
      if (itemAddons.length > 0) {
        itemAddons.forEach((addon) => {
          message += `   • ${addon.quantity}x ${addon.name}\n`;
        });
      }

      // Adicionar observação, se houver
      if (item.observation) {
        message += `   Obs: ${item.observation}\n`;
      }
    });

    // Processar produtos customizados
    customItems.forEach((item, index) => {
      const mainItemsCount = mainItems.length;
      message += `${mainItemsCount + index + 1}. ${item.quantity}x ${
        item.name
      } (Personalizado) - ${item.totalPriceFormatted}\n`;

      // Adicionar detalhes de personalização
      if (item.customProductSteps && item.customProductSteps.length > 0) {
        item.customProductSteps.forEach((step) => {
          if (step.stepName) {
            message += `   • ${step.stepName}: `;
          }

          const itemNames = step.selectedItems.map((i) => i.name).join(", ");
          message += `${itemNames}\n`;
        });
      }

      // Adicionar observação, se houver
      if (item.observation) {
        message += `   Obs: ${item.observation}\n`;
      }
    });

    // Adicionar informações de pagamento de forma mais clara
    message += `\n*PAGAMENTO:*\n`;
    let paymentMethodText = "";

    switch (paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        paymentMethodText = "PIX";
        break;
      case CheckoutPaymentMethod.CREDIT_CARD:
        paymentMethodText = "Cartão de Crédito";
        break;
      case CheckoutPaymentMethod.DEBIT_CARD:
        paymentMethodText = "Cartão de Débito";
        break;
      case CheckoutPaymentMethod.CASH:
        paymentMethodText = "Dinheiro";
        if (paymentInfo.change) {
          paymentMethodText += ` (Troco para R$ ${paymentInfo.change})`;
        }
        break;
    }

    message += `Forma de pagamento: ${paymentMethodText}\n`;

    // Adicionar detalhamento do valor com taxa de entrega
    message += `Subtotal: ${subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}\n`;

    if (deliveryType === CheckoutDeliveryType.DELIVERY) {
      message += `Taxa de entrega: ${
        deliveryFee > 0
          ? deliveryFee.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "Grátis"
      }\n`;
    }

    message += `Total: ${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}\n\n`;

    // Agradecimento
    message += `Obrigado pelo seu pedido!`;

    return message;
  }
}
