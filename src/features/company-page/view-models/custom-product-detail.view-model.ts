// Path: src/features/company-page/view-models/custom-product-detail.view-model.ts

import { useState, useEffect, useCallback } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useLocalSearchParams, router } from "expo-router";
import {
  CustomProductDetail,
  CustomProductItem,
  CustomProductSelection,
} from "../models/custom-product";
import { customProductService } from "../services/custom-product.service";

export interface CustomProductDetailViewModel {
  // Estado
  product: CustomProductDetail | null;
  isLoading: boolean;
  error: Error | null;
  selections: CustomProductSelection[];
  totalPrice: number;
  observation: string;
  showObservationInput: boolean;
  isConfirmationVisible: boolean;
  lastAddedItem: any;
  companySlug: string; // Adicionando companySlug para garantir acesso

  // Calculated properties
  canAddToCart: () => boolean;
  getFormattedPrice: () => string;

  // Ações para seleções
  toggleItemSelection: (stepNumber: number, item: CustomProductItem) => void;
  isItemSelected: (stepNumber: number, itemId: string) => boolean;
  isStepComplete: (stepNumber: number) => boolean;
  getRequiredSelectionsForStep: (stepNumber: number) => number;
  getMinimumSelectionsForStep: (stepNumber: number) => number;
  getCurrentSelectionsForStep: (stepNumber: number) => number;

  // Ações para o carrinho
  addToCart: () => void;

  // Ações para observação
  setObservation: (text: string) => void;
  toggleObservationInput: () => void;

  // Ações para confirmação
  showConfirmation: () => void;
  hideConfirmation: () => void;
  resetState: () => void;
}

export function useCustomProductDetailViewModel(
  productId: string
): CustomProductDetailViewModel {
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const toast = useToast();
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  // Garantir que companySlug seja definido corretamente
  const [currentCompanySlug, setCurrentCompanySlug] = useState<string>(
    companySlug || ""
  );

  const [product, setProduct] = useState<CustomProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selections, setSelections] = useState<CustomProductSelection[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [observation, setObservation] = useState("");
  const [showObservationInput, setShowObservationInput] = useState(false);

  // Estados para o modal de confirmação
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<any>(null);

  // Atualizar o companySlug se mudar nos parâmetros
  useEffect(() => {
    if (companySlug) {
      setCurrentCompanySlug(companySlug);
    } else if (vm.profile?.empresa.slug) {
      // Fallback para o slug da empresa do contexto, se disponível
      setCurrentCompanySlug(vm.profile.empresa.slug);
    }
  }, [companySlug, vm.profile]);

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await customProductService.getCustomProductDetails(
        productId
      );
      setProduct(data);

      // Initialize selections for each step
      const initialSelections = data.passos.map((step) => ({
        stepNumber: step.passo_numero,
        selectedItems: [],
      }));

      setSelections(initialSelections);
    } catch (err) {
      console.error("Error fetching custom product details:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to load product details")
      );
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  // Calculate total price whenever selections change
  useEffect(() => {
    if (!product) return;

    let total = 0;

    // Para preço tipo "soma", somamos o preço de todos os itens selecionados
    if (product.preco_tipo === "soma") {
      selections.forEach((selection) => {
        selection.selectedItems.forEach((item) => {
          const price = parseFloat(
            item.produto_detalhes.preco_promocional ||
              item.produto_detalhes.preco ||
              "0"
          );
          if (!isNaN(price)) {
            total += price;
          }
        });
      });
    }
    // Para preço tipo "menor", pegamos o menor preço (não implementado ainda)
    else if (product.preco_tipo === "menor") {
      // Implementação futura
      total = 0;
    }
    // Se tiver um preço fixo definido no produto
    else if (product.preco) {
      const preco = product.preco.replace(",", "."); // Corrigindo formatação do preço
      total = parseFloat(preco);
    }

    setTotalPrice(total);
  }, [selections, product]);

  // Toggle item selection for a step - Simplified logic without toast
  const toggleItemSelection = useCallback(
    (stepNumber: number, item: CustomProductItem) => {
      setSelections((prev) => {
        const updatedSelections = [...prev];
        const stepIndex = updatedSelections.findIndex(
          (s) => s.stepNumber === stepNumber
        );

        if (stepIndex === -1) return prev;

        const step = { ...updatedSelections[stepIndex] };
        const itemIndex = step.selectedItems.findIndex(
          (i) => i.produtos.key === item.produtos.key
        );

        // If already selected, remove it
        if (itemIndex !== -1) {
          step.selectedItems = step.selectedItems.filter(
            (_, idx) => idx !== itemIndex
          );
        } else {
          // Find the step in the product
          const productStep = product?.passos.find(
            (s) => s.passo_numero === stepNumber
          );
          const maxSelections = productStep?.qtd_items_step || 0;

          // Add item if not exceeding limit
          if (
            maxSelections === 0 ||
            step.selectedItems.length < maxSelections
          ) {
            step.selectedItems = [...step.selectedItems, item];
          } else {
            // Replace the first item if max reached - without toast
            step.selectedItems = [...step.selectedItems.slice(1), item];
          }
        }

        updatedSelections[stepIndex] = step;
        return updatedSelections;
      });
    },
    [product]
  );

  const toggleObservationInput = useCallback(() => {
    setShowObservationInput((prev) => !prev);
  }, []);

  // Check if an item is selected
  const isItemSelected = useCallback(
    (stepNumber: number, itemId: string) => {
      const stepSelection = selections.find((s) => s.stepNumber === stepNumber);
      if (!stepSelection) return false;

      return stepSelection.selectedItems.some(
        (item) => item.produtos.key === itemId
      );
    },
    [selections]
  );

  // Get minimum required selections for a step
  const getMinimumSelectionsForStep = useCallback(
    (stepNumber: number) => {
      const step = product?.passos.find((s) => s.passo_numero === stepNumber);
      // Se quantidade_minima_itens não estiver definida, for 0 ou null, não é obrigatório selecionar nada
      return step?.quantidade_minima_itens || 0;
    },
    [product]
  );

  // Check if a step is complete
  const isStepComplete = useCallback(
    (stepNumber: number) => {
      const stepSelection = selections.find((s) => s.stepNumber === stepNumber);
      if (!stepSelection) return false;

      const minimumSelections = getMinimumSelectionsForStep(stepNumber);

      return stepSelection.selectedItems.length >= minimumSelections;
    },
    [selections, getMinimumSelectionsForStep]
  );

  // Get maximum selections allowed for a step
  const getRequiredSelectionsForStep = useCallback(
    (stepNumber: number) => {
      const step = product?.passos.find((s) => s.passo_numero === stepNumber);
      return step?.qtd_items_step || 0;
    },
    [product]
  );

  // Get current selections for a step
  const getCurrentSelectionsForStep = useCallback(
    (stepNumber: number) => {
      const stepSelection = selections.find((s) => s.stepNumber === stepNumber);
      return stepSelection?.selectedItems.length || 0;
    },
    [selections]
  );

  // Format price to Brazilian currency
  const getFormattedPrice = useCallback(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalPrice);
  }, [totalPrice]);

  // Check if can add to cart (all required steps are complete)
  const canAddToCart = useCallback(() => {
    if (!product) return false;

    // Verifica se todos os passos obrigatórios (com quantidade_minima_itens > 0) estão completos
    return product.passos.every((step) => {
      const minimumRequired = step.quantidade_minima_itens || 0;
      if (minimumRequired === 0) return true; // Passo não obrigatório

      const currentSelections = getCurrentSelectionsForStep(step.passo_numero);
      return currentSelections >= minimumRequired;
    });
  }, [product, getCurrentSelectionsForStep]);

  const resetState = useCallback(() => {
    // Reinicializar seleções
    if (product) {
      const initialSelections = product.passos.map((step) => ({
        stepNumber: step.passo_numero,
        selectedItems: [],
      }));
      setSelections(initialSelections);
    }

    setObservation("");
    setShowObservationInput(false);
  }, [product]);

  // Funções para o modal de confirmação
  const showConfirmation = useCallback(() => {
    setIsConfirmationVisible(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsConfirmationVisible(false);

    // Resetar o estado
    resetState();

    // Voltar para a página da empresa
    if (currentCompanySlug) {
      router.replace(`/(drawer)/empresa/${currentCompanySlug}`);
    } else {
      router.back();
    }
  }, [currentCompanySlug, resetState]);

  // Add to cart function
  const addToCart = useCallback(() => {
    if (!product) return;

    // Check if all required steps are complete
    if (!canAddToCart()) {
      toastUtils.warning(toast, "Complete todas as seleções obrigatórias");
      return;
    }

    // Verificar se temos um slug válido
    if (!currentCompanySlug) {
      console.error(
        "CompanySlug não disponível para adicionar produto ao carrinho"
      );
      toastUtils.error(
        toast,
        "Erro ao adicionar ao carrinho. Empresa não identificada."
      );
      return;
    }

    // Usar o nome da empresa do contexto ou do produto
    const companyName = vm.profile?.nome || "Loja";

    // Adicionar ao carrinho usando a função específica
    cartVm.addCustomProduct(
      product,
      currentCompanySlug,
      companyName,
      selections,
      totalPrice,
      1, // Quantidade padrão para produtos customizados
      observation.trim()
    );

    // Preparar os steps para exibição na confirmação
    const customizationSteps = selections.map((selection) => {
      const step = product.passos.find(
        (p) => p.passo_numero === selection.stepNumber
      );
      return {
        name: step?.nome || `Passo ${selection.stepNumber}`,
        items: selection.selectedItems.map(
          (item) => item.produto_detalhes.nome
        ),
      };
    });

    // Salvar informações do item para o modal de confirmação
    setLastAddedItem({
      productName: product.nome,
      quantity: 1,
      totalPrice: getFormattedPrice(),
      customization: {
        steps: customizationSteps,
      },
      observation: observation.trim(),
    });

    // Exibir toast de sucesso
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);

    // Mostrar modal de confirmação
    showConfirmation();
  }, [
    product,
    selections,
    totalPrice,
    observation,
    cartVm,
    toast,
    canAddToCart,
    getFormattedPrice,
    showConfirmation,
    currentCompanySlug,
    vm.profile,
  ]);

  return {
    product,
    isLoading,
    error,
    selections,
    totalPrice,
    observation,
    showObservationInput,
    isConfirmationVisible,
    lastAddedItem,
    companySlug: currentCompanySlug, // Expondo companySlug para usar onde necessário
    toggleItemSelection,
    isItemSelected,
    isStepComplete,
    getRequiredSelectionsForStep,
    getMinimumSelectionsForStep,
    getCurrentSelectionsForStep,
    canAddToCart,
    addToCart,
    getFormattedPrice,
    setObservation,
    toggleObservationInput,
    showConfirmation,
    hideConfirmation,
    resetState,
  };
}
