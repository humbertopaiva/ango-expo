// Path: src/features/company-page/view-models/custom-product-detail.view-model.ts
import { useState, useEffect, useCallback } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";

import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import {
  CustomProductDetail,
  CustomProductItem,
  CustomProductSelection,
} from "../models/custom-product";
import { customProductService } from "../services/custom-product.service";

export interface CustomProductDetailViewModel {
  // State
  product: CustomProductDetail | null;
  isLoading: boolean;
  error: Error | null;
  selections: CustomProductSelection[];
  totalPrice: number;

  // Actions
  toggleItemSelection: (stepNumber: number, item: CustomProductItem) => void;
  isItemSelected: (stepNumber: number, itemId: string) => boolean;
  isStepComplete: (stepNumber: number) => boolean;
  getRequiredSelectionsForStep: (stepNumber: number) => number;
  getCurrentSelectionsForStep: (stepNumber: number) => number;
  addToCart: () => void;
  getFormattedPrice: () => string;
}

export function useCustomProductDetailViewModel(
  productId: string
): CustomProductDetailViewModel {
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const toast = useToast();

  const [product, setProduct] = useState<CustomProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selections, setSelections] = useState<CustomProductSelection[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

    // Sum up prices from all selected items
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

    setTotalPrice(total);
  }, [selections, product]);

  // Toggle item selection for a step
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
          if (step.selectedItems.length < maxSelections) {
            step.selectedItems = [...step.selectedItems, item];
          } else {
            // Replace the first item if max reached
            step.selectedItems = [...step.selectedItems.slice(1), item];

            // Show toast about replacing
            toastUtils.info(
              toast,
              `Limite de seleção atingido. Item substituído.`
            );
          }
        }

        updatedSelections[stepIndex] = step;
        return updatedSelections;
      });
    },
    [product, toast]
  );

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

  // Check if a step is complete
  const isStepComplete = useCallback(
    (stepNumber: number) => {
      const stepSelection = selections.find((s) => s.stepNumber === stepNumber);
      if (!stepSelection) return false;

      const productStep = product?.passos.find(
        (s) => s.passo_numero === stepNumber
      );
      const requiredSelections = productStep?.qtd_items_step || 0;

      return stepSelection.selectedItems.length >= requiredSelections;
    },
    [selections, product]
  );

  // Get required selections for a step
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

  // Add to cart function
  const addToCart = useCallback(() => {
    if (!product || !vm.profile) return;

    // Check if all steps are complete
    const allStepsComplete = product.passos.every((step) =>
      isStepComplete(step.passo_numero)
    );

    if (!allStepsComplete) {
      toastUtils.warning(
        toast,
        "Por favor, complete todas as etapas antes de adicionar ao carrinho."
      );
      return;
    }

    // Create cart item object
    const cartItem = {
      id: product.id,
      nome: product.nome,
      descricao: product.descricao,
      imagem: product.imagem,
      preco: totalPrice.toString(),
      preco_promocional: null,
      empresa: {
        nome: vm.profile.nome,
        slug: vm.profile.empresa.slug,
      },
      selections: selections,
      isCustomProduct: true,
    };

    // Add to cart
    // cartVm.addCustomProduct(cartItem, vm.profile.empresa.slug, vm.profile.nome);

    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  }, [
    product,
    vm.profile,
    selections,
    totalPrice,
    isStepComplete,
    cartVm,
    toast,
  ]);

  return {
    product,
    isLoading,
    error,
    selections,
    totalPrice,
    toggleItemSelection,
    isItemSelected,
    isStepComplete,
    getRequiredSelectionsForStep,
    getCurrentSelectionsForStep,
    addToCart,
    getFormattedPrice,
  };
}
