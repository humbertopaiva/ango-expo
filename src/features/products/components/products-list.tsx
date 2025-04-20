// Path: src/features/products/components/products-list.tsx
// Adicione badges para indicar produtos com variações

import React from "react";
import { Product } from "../models/product";
import { SwipeableDataList } from "@/components/custom/swipeable-data-list";
import { Package, Tag } from "lucide-react-native";
import { ProductSkeletonList } from "./product-skeleton";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onItemPress?: (product: Product) => void;
}

export function ProductsList({
  products = [],
  isLoading = false,
  onEdit = () => {},
  onDelete = () => {},
  onItemPress,
}: ProductsListProps) {
  return (
    <SwipeableDataList
      data={products}
      isLoading={isLoading}
      emptyMessage="Nenhum produto encontrado. Crie um novo produto para começar."
      renderSkeleton={() => <ProductSkeletonList count={3} />}
      getTitle={(product) => product.nome}
      getPrice={(product) => product.preco}
      getPromotionalPrice={(product) => product.preco_promocional || undefined}
      getImageUri={(product) => product.imagem}
      getImageIcon={() => Package}
      getStatus={(product) => product.status}
      getStatusLabel={(product) =>
        product.status === "disponivel" ? "Disponível" : "Indisponível"
      }
      onEdit={onEdit}
      onDelete={onDelete}
      onItemPress={onItemPress}
    />
  );
}
