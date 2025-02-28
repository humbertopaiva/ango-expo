// src/features/products/components/products-list.tsx
import React from "react";
import { Product } from "../models/product";
import { DataList } from "@/components/custom/data-list";
import { ListItem } from "@/components/custom/list-item";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsList({
  products = [],
  isLoading = false,
  onEdit = () => {},
  onDelete = () => {},
}: ProductsListProps) {
  return (
    <DataList
      data={products}
      isLoading={isLoading}
      emptyMessage="Nenhum produto encontrado. Crie um novo produto para começar."
      renderItem={(product) => (
        <ListItem
          title={product.nome}
          description={product.descricao}
          price={product.preco}
          promotionalPrice={product.preco_promocional ?? undefined}
          imageUri={product.imagem}
          status={product.status}
          statusLabel={
            product.status === "disponivel" ? "Disponível" : "Indisponível"
          }
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
          metadata={[]}
        />
      )}
    />
  );
}
