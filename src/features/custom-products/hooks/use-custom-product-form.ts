// Path: src/features/custom-products/hooks/use-custom-product-form.ts
import { useState, useEffect } from "react";
import { useProducts } from "@/src/features/products/hooks/use-products";
import {
  CustomProductStep,
  CustomProductStepItem,
} from "../models/custom-product";
import { Product } from "@/src/features/products/models/product";

export function useCustomProductForm(initialSteps: CustomProductStep[] = []) {
  const [steps, setSteps] = useState<CustomProductStep[]>(initialSteps);
  const { products, isLoading: isProductsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar um novo passo
  const addStep = () => {
    const newStepNumber =
      steps.length > 0 ? Math.max(...steps.map((s) => s.passo_numero)) + 1 : 1;

    setSteps([
      ...steps,
      {
        passo_numero: newStepNumber,
        qtd_items_step: 1,
        produtos: [],
      },
    ]);
  };

  // Remover um passo existente
  const removeStep = (stepNumber: number) => {
    const newSteps = steps.filter((step) => step.passo_numero !== stepNumber);

    // Reordenar os passos restantes
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      passo_numero: index + 1,
    }));

    setSteps(reorderedSteps);
  };

  // Atualizar a quantidade de itens de um passo
  const updateStepQuantity = (stepNumber: number, quantity: number) => {
    setSteps(
      steps.map((step) =>
        step.passo_numero === stepNumber
          ? { ...step, qtd_items_step: quantity }
          : step
      )
    );
  };

  // Adicionar um produto a um passo
  const addProductToStep = (stepNumber: number, product: Product) => {
    setSteps(
      steps.map((step) => {
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
  };

  // Remover um produto de um passo
  const removeProductFromStep = (stepNumber: number, productKey: string) => {
    setSteps(
      steps.map((step) => {
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
  };

  return {
    steps,
    setSteps,
    addStep,
    removeStep,
    updateStepQuantity,
    addProductToStep,
    removeProductFromStep,
    products,
    filteredProducts,
    isProductsLoading,
    searchTerm,
    setSearchTerm,
  };
}
