// Path: src/features/shop-window/components/simple-produto-item.tsx
import React from "react";
import { View, Text } from "react-native";
import { DollarSign, Package } from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { ReorderButtons } from "@/components/common/reorder-buttons";

interface SimpleProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SimpleProdutoItem({
  produto,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SimpleProdutoItemProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const renderProductContent = () => (
    <View className="p-2 flex-row">
      {/* Área de reordenação ou imagem */}
      <View className="pr-2">
        {isReordering ? (
          <ReorderButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        ) : (
          <View className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
            {produto.produto.imagem ? (
              <ResilientImage
                source={produto.produto.imagem}
                style={{ height: "100%", width: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Package size={20} color="#6B7280" />
              </View>
            )}
          </View>
        )}
      </View>

      {/* Informações do produto */}
      <View className="flex-1">
        {/* Status de disponibilidade */}
        <View className="flex-row mb-0.5">
          <View
            className={`px-1.5 py-0.5 rounded-full ${
              produto.disponivel ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs ${
                produto.disponivel ? "text-green-700" : "text-gray-700"
              }`}
            >
              {produto.disponivel ? "Disponível" : "Indisponível"}
            </Text>
          </View>
        </View>

        {/* Nome do produto */}
        <Text className="font-medium text-sm" numberOfLines={2}>
          {produto.produto.nome}
        </Text>

        {/* Informações de preço */}
        <View className="flex-row items-center mt-0.5 flex-wrap">
          <View className="flex-row items-center bg-gray-50 px-1.5 py-0.5 rounded-md mr-2">
            <DollarSign size={10} color="#4B5563" />
            <Text className="font-medium text-xs text-gray-700 ml-0.5">
              {formatCurrency(produto.produto.preco)}
            </Text>
          </View>

          {produto.produto.preco_promocional && (
            <Text className="text-xs text-gray-500 line-through">
              {formatCurrency(produto.produto.preco_promocional)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  // Durante a reordenação, desative o swipe
  if (isReordering) {
    return <View className="mb-3">{renderProductContent()}</View>;
  }

  // Caso contrário, use o SwipeableCard
  return (
    <SwipeableCard
      onDelete={() => onDelete(produto)}
      disableEdit={true} // Produtos não têm edição, apenas exclusão
      position={position}
      badgeColor="bg-primary-100"
    >
      {renderProductContent()}
    </SwipeableCard>
  );
}
