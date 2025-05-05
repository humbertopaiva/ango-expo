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

    // Garantir que a taxa de entrega seja um número válido
    const validDeliveryFee = isNaN(deliveryFee) ? 0 : deliveryFee;

    // Adicionar taxa de entrega se o método de entrega for selecionado
    const finalDeliveryFee = isDelivery ? validDeliveryFee : 0;

    console.log(
      `Calculando total: Subtotal=${subtotal}, DeliveryFee=${finalDeliveryFee}, isDelivery=${isDelivery}`
    );

    // Retornar o valor total
    return subtotal + finalDeliveryFee;
  }

  /**
   * Calcula o total final do pedido considerando o tipo de entrega
   * @param subtotal Valor subtotal dos itens
   * @param deliveryFee Valor da taxa de entrega
   * @param isDelivery Se a entrega está selecionada
   * @returns Valor total final do pedido
   */
  static calculateFinalTotal(
    subtotal: number,
    deliveryFee: number = 0,
    isDelivery: boolean = true
  ): number {
    return isDelivery ? subtotal + deliveryFee : subtotal;
  }

  /**
   * Formata os itens para a mensagem de WhatsApp no checkout
   * @param checkoutData Dados do checkout
   * @returns Mensagem formatada
   */

  // Modificar apenas o método formatWhatsAppMessage

  // Path: src/features/checkout/services/cart-processor.service.ts
  // Modificar apenas o método formatWhatsAppMessage

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

    // Calcular o valor final correto baseado no tipo de entrega
    const finalTotal =
      deliveryType === CheckoutDeliveryType.PICKUP ? subtotal : total;

    // Processar os itens em categorias
    const { mainItems, addons, customItems } = this.processItems(items);

    // ===== CABEÇALHO =====
    let message = `🛍️ *NOVO PEDIDO - ${companyName}*\n`;
    message += `📆 Data: ${new Date().toLocaleDateString("pt-BR")}\n`;
    message += `⏰ Hora: ${new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}\n\n`;

    // ===== TIPO DE ENTREGA =====
    message += `🚚 *FORMA DE RECEBIMENTO:* ${
      deliveryType === CheckoutDeliveryType.DELIVERY
        ? "Entrega"
        : "Retirada no local"
    }\n\n`;

    // ===== DADOS DO CLIENTE =====
    message += `👤 *DADOS DO CLIENTE:*\n`;
    message += `📝 Nome: ${personalInfo.fullName}\n`;
    message += `📱 WhatsApp: ${personalInfo.whatsapp}\n`;

    // ===== ENDEREÇO (SE FOR ENTREGA) =====
    if (deliveryType === CheckoutDeliveryType.DELIVERY) {
      message += `\n📍 *ENDEREÇO DE ENTREGA:*\n`;
      message += `🏠 ${personalInfo.address}, ${personalInfo.number}\n`;
      message += `🏙️ Bairro: ${personalInfo.neighborhood}\n`;
      message += `🌆 Cidade: Lima Duarte (MG)\n`;

      if (personalInfo.reference) {
        message += `🔍 Referência: ${personalInfo.reference}\n`;
      }
    }

    // ===== ITENS DO PEDIDO =====
    message += `\n📋 *ITENS DO PEDIDO:*\n`;

    // Contador para numerar os itens do pedido
    let itemNumber = 1;

    // ===== PRODUTOS PRINCIPAIS COM ADICIONAIS =====
    mainItems.forEach((item) => {
      // Numeração e informações básicas do item
      message += `\n*${itemNumber}. ${item.name}*`;
      if (item.hasVariation && item.variationName) {
        message += ` _(${item.variationName})_`;
      }
      message += `\n`;

      // Quantidade e preço
      message += `   • Quantidade: ${item.quantity}\n`;
      message += `   • Valor: ${item.totalPriceFormatted}\n`;

      // Adicionais do item principal
      const itemAddons = addons[item.id] || [];
      if (itemAddons.length > 0) {
        message += `   • *Adicionais:*\n`;
        itemAddons.forEach((addon) => {
          // Formatação de preço para o adicional
          const addonTotalPrice = (addon.price * addon.quantity).toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          );

          message += `      - ${addon.quantity}x ${addon.name}: ${addonTotalPrice}\n`;
        });
      }

      // Observação do item
      if (item.observation) {
        message += `   • *Observação:* ${item.observation}\n`;
      }

      // Incrementar o contador de itens
      itemNumber++;
    });

    // ===== PRODUTOS CUSTOMIZADOS =====
    customItems.forEach((item) => {
      // Numeração e informações básicas do item customizado
      message += `\n*${itemNumber}. ${item.name} (Personalizado)*\n`;
      message += `   • Quantidade: ${item.quantity}\n`;
      message += `   • Valor: ${item.totalPriceFormatted}\n`;

      // Detalhes dos passos customizados
      if (item.customProductSteps && item.customProductSteps.length > 0) {
        message += `   • *Seleções personalizadas:*\n`;
        item.customProductSteps.forEach((step) => {
          const stepName = step.stepName ? step.stepName : "Opções";
          const selectedItems = step.selectedItems
            .map((i) => i.name)
            .join(", ");
          message += `      - ${stepName}: ${selectedItems}\n`;
        });
      }

      // Observação do item customizado
      if (item.observation) {
        message += `   • *Observação:* ${item.observation}\n`;
      }

      // Incrementar o contador de itens
      itemNumber++;
    });

    // ===== RESUMO DE PAGAMENTO =====
    message += `\n💰 *RESUMO DE VALORES:*\n`;
    message += `📦 Subtotal dos itens: ${subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}\n`;

    // Mostrar taxa de entrega ou indicar que é retirada no local
    if (deliveryType === CheckoutDeliveryType.DELIVERY) {
      message += `🚚 Taxa de entrega: ${
        deliveryFee > 0
          ? deliveryFee.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "Grátis"
      }\n`;
    } else {
      message += `🚚 Entrega: Grátis (Retirada no local)\n`;
    }

    // Total final
    message += `💵 *Valor Total: ${finalTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}*\n`;

    // ===== PAGAMENTO =====
    message += `\n💳 *FORMA DE PAGAMENTO:*\n`;

    let paymentMethodText = "";
    let paymentIcon = "";

    switch (paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        paymentMethodText = "PIX";
        paymentIcon = "📱";
        break;
      case CheckoutPaymentMethod.CREDIT_CARD:
        paymentMethodText = "Cartão de Crédito";
        paymentIcon = "💳";
        break;
      case CheckoutPaymentMethod.DEBIT_CARD:
        paymentMethodText = "Cartão de Débito";
        paymentIcon = "💳";
        break;
      case CheckoutPaymentMethod.CASH:
        paymentMethodText = "Dinheiro";
        paymentIcon = "💵";
        break;
    }

    message += `${paymentIcon} ${paymentMethodText}`;

    // Adiciona informação de troco, se aplicável
    if (
      paymentInfo.method === CheckoutPaymentMethod.CASH &&
      paymentInfo.change
    ) {
      message += ` (Troco para ${paymentInfo.change})`;
    }

    return message;
  }
}
