// Path: src/features/custom-products/hooks/use-custom-product-form.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { useProducts } from "@/src/features/products/hooks/use-products";
import {
  CustomProductStep,
  CustomProductStepItem,
} from "../models/custom-product";
import { Product } from "@/src/features/products/models/product";

export function useCustomProductForm(initialSteps: CustomProductStep[] = []) {
  const [steps, setSteps] = useState<CustomProductStep[]>([]);
  const { products, isLoading: isProductsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // Referência para controlar a inicialização
  const initializedRef = useRef(false);

  // Importante: Inicializar os passos quando initialSteps mudar
  useEffect(() => {
    // Evitar inicialização repetida devido a re-renderizações
    if (initializedRef.current && initialSteps.length === 0) {
      return;
    }

    if (initialSteps && initialSteps.length > 0) {
      // Certifique-se de criar uma cópia profunda para não modificar o objeto original
      const formattedSteps = initialSteps.map((step) => ({
        passo_numero: step.passo_numero,
        qtd_items_step: step.qtd_items_step,
        nome: step.nome || `Passo ${step.passo_numero}`,
        descricao: step.descricao || "",
        produtos: Array.isArray(step.produtos) ? [...step.produtos] : [],
      }));

      setSteps(formattedSteps);
      console.log(
        "Passos inicializados no hook:",
        JSON.stringify(formattedSteps)
      );
      initializedRef.current = true;
    } else if (!initializedRef.current) {
      setSteps([]);
      initializedRef.current = true;
    }
  }, [JSON.stringify(initialSteps)]); // Use JSON.stringify para comparação profunda

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar um novo passo
  const addStep = useCallback(() => {
    const newStepNumber =
      steps.length > 0 ? Math.max(...steps.map((s) => s.passo_numero)) + 1 : 1;

    setSteps((prevSteps) => [
      ...prevSteps,
      {
        passo_numero: newStepNumber,
        qtd_items_step: 1,
        nome: `Passo ${newStepNumber}`,
        descricao: "",
        produtos: [],
      },
    ]);
  }, [steps]);

  // Remover um passo existente
  const removeStep = useCallback((stepNumber: number) => {
    setSteps((prevSteps) => {
      const newSteps = prevSteps.filter(
        (step) => step.passo_numero !== stepNumber
      );

      // Reordenar os passos restantes
      const reorderedSteps = newSteps.map((step, index) => ({
        ...step,
        passo_numero: index + 1,
        nome: step.nome || `Passo ${index + 1}`,
      }));

      return reorderedSteps;
    });
  }, []);

  // Atualizar a quantidade de itens de um passo
  const updateStepQuantity = useCallback(
    (stepNumber: number, quantity: number) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.passo_numero === stepNumber
            ? { ...step, qtd_items_step: quantity }
            : step
        )
      );
    },
    []
  );

  // Atualizar o nome de um passo
  const updateStepName = useCallback((stepNumber: number, name: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.passo_numero === stepNumber ? { ...step, nome: name } : step
      )
    );
  }, []);

  // Atualizar a descrição de um passo
  const updateStepDescription = useCallback(
    (stepNumber: number, description: string) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.passo_numero === stepNumber
            ? { ...step, descricao: description }
            : step
        )
      );
    },
    []
  );

  // Adicionar um produto a um passo
  const addProductToStep = useCallback(
    (stepNumber: number, product: Product) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.passo_numero === stepNumber) {
            // Verificar se o produto já existe no passo
            const productExists = step.produtos.some(
              (p) => p.produtos.key === product.id
            );

            if (!productExists) {
              return {
                ...step,
                produtos: [
                  ...step.produtos,
                  {
                    produtos: {
                      key: product.id,
                      collection: "produtos",
                    },
                  },
                ],
              };
            }
          }
          return step;
        })
      );
    },
    []
  );

  // Remover um produto de um passo
  const removeProductFromStep = useCallback(
    (stepNumber: number, productKey: string) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.passo_numero === stepNumber) {
            return {
              ...step,
              produtos: step.produtos.filter(
                (p) => p.produtos.key !== productKey
              ),
            };
          }
          return step;
        })
      );
    },
    []
  );

  // Calcular preço baseado no tipo (menor, maior, média)
  const calculatePrice = useCallback(
    (priceType: "menor" | "media" | "maior"): string => {
      // Obter todos os produtos selecionados em todos os passos
      const allSelectedProducts = steps
        .flatMap((step) =>
          step.produtos.map((productItem) => {
            const productDetails = products.find(
              (p) => p.id === productItem.produtos.key
            );
            return productDetails ? parseFloat(productDetails.preco || "0") : 0;
          })
        )
        .filter((price) => price > 0);

      if (allSelectedProducts.length === 0) return "0";

      switch (priceType) {
        case "menor":
          return Math.min(...allSelectedProducts).toFixed(2);
        case "maior":
          return Math.max(...allSelectedProducts).toFixed(2);
        case "media":
          const sum = allSelectedProducts.reduce(
            (acc, price) => acc + price,
            0
          );
          return (sum / allSelectedProducts.length).toFixed(2);
        default:
          return "0";
      }
    },
    [steps, products]
  );

  return {
    steps,
    setSteps,
    addStep,
    removeStep,
    updateStepQuantity,
    updateStepName,
    updateStepDescription,
    addProductToStep,
    removeProductFromStep,
    calculatePrice,
    products,
    filteredProducts,
    isProductsLoading,
    searchTerm,
    setSearchTerm,
  };
}
