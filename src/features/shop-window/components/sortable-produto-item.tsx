// Path: src/features/shop-window/components/sortable-produto-item.tsx
import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  Trash,
  DollarSign,
  MoreVertical,
  Layers,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";
import { ReorderButtons } from "@/components/common/reorder-buttons";

interface SortableProdutoItemProps {
  produto: VitrineProduto;
  onDelete: (produto: VitrineProduto) => void;
  onEdit?: (produto: VitrineProduto) => void; // Agora é opcional, pois foi adicionado
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SortableProdutoItem({
  produto,
  onDelete,
  onEdit,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SortableProdutoItemProps) {
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Função para mostrar ou esconder as ações
  const toggleActions = () => {
    if (isActionsVisible) {
      // Esconder ações
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(false);
    } else {
      // Mostrar ações
      Animated.spring(slideAnim, {
        toValue: -100, // Valor negativo para deslizar para a esquerda
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(true);
    }
  };

  // Determinar se é um produto com variação e tem produto variado selecionado
  const hasVariation = !!produto.produto.variacao;
  const hasVariationSelected = !!produto.produto_variado;

  // Obter a imagem correta (do produto variado se disponível, senão do produto principal)
  const productImage =
    produto.produto_variado?.imagem || produto.produto.imagem;

  // Obter o preço correto (do produto variado se disponível, senão do produto principal)
  const productPrice = produto.produto_variado?.preco || produto.produto.preco;
  const productPromotionalPrice =
    produto.produto_variado?.preco_promocional ||
    produto.produto.preco_promocional;

  return (
    <View className="overflow-hidden relative mb-3">
      {/* Botões de ação que aparecem ao deslizar */}
      <View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-center h-full"
        style={{ width: 100 }}
      >
        {/* Adicionar botão de edição se disponível */}
        {onEdit && (
          <Pressable
            onPress={() => onEdit(produto)}
            className="bg-gray-100 h-full w-1/2 items-center justify-center"
          >
            <Text className="text-gray-700 font-medium">Editar</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => onDelete(produto)}
          className="bg-red-100 h-full w-1/2 items-center justify-center"
        >
          <Trash size={20} color="#ef4444" />
        </Pressable>
      </View>

      {/* Card principal que desliza */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Card
          className={`bg-white shadow-sm border border-gray-100 overflow-hidden ${
            !produto.disponivel ? "opacity-70" : ""
          }`}
        >
          {/* Posição do item como "tag" no canto superior direito */}
          {!isReordering && position && (
            <View className="absolute top-0 right-0 bg-primary-100 rounded-bl-lg px-1.5 py-0.5 z-10">
              <Text className="text-xs font-bold text-primary-700">
                #{position}
              </Text>
            </View>
          )}

          <View className="p-3 flex-row items-center">
            {/* Área de reordenação ou imagem */}
            {isReordering ? (
              <View className="mr-3">
                <ReorderButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
              </View>
            ) : (
              <View className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden mr-3">
                {productImage ? (
                  <ResilientImage
                    source={productImage}
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

                {/* Badge de variação */}
                {hasVariation && (
                  <View
                    className="px-1.5 py-0.5 rounded-full ml-1 flex-row items-center"
                    style={{
                      backgroundColor: hasVariationSelected
                        ? "#DBEAFE"
                        : "#FEE2E2",
                    }}
                  >
                    <Layers
                      size={10}
                      color={hasVariationSelected ? "#1D4ED8" : "#DC2626"}
                    />
                    <Text
                      className="text-xs ml-1"
                      style={{
                        color: hasVariationSelected ? "#1D4ED8" : "#DC2626",
                      }}
                    >
                      {hasVariationSelected
                        ? produto.produto_variado?.valor_variacao
                        : "Sem variação"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Nome do produto */}
              <Text className="font-medium text-sm" numberOfLines={2}>
                {produto.produto.nome}
              </Text>

              {/* Informações de preço */}
              {productPrice || hasVariationSelected ? (
                <View className="flex-row items-center mt-0.5 flex-wrap">
                  <View className="flex-row items-center bg-gray-50 px-1.5 py-0.5 rounded-md mr-2">
                    <DollarSign size={10} color="#4B5563" />
                    <Text className="font-medium text-xs text-gray-700 ml-0.5">
                      {formatCurrency(productPrice)}
                    </Text>
                  </View>

                  {productPromotionalPrice && (
                    <Text className="text-xs text-gray-500 line-through">
                      {formatCurrency(productPromotionalPrice)}
                    </Text>
                  )}
                </View>
              ) : (
                <Text className="text-xs text-red-500 mt-0.5">
                  {hasVariation
                    ? "Selecione uma variação"
                    : "Preço não definido"}
                </Text>
              )}
            </View>

            {/* Botão de mais opções - apenas visível quando não está reordenando */}
            {!isReordering && (
              <Pressable
                onPress={toggleActions}
                className="p-1 ml-1 self-center"
              >
                <MoreVertical size={18} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </Card>
      </Animated.View>
    </View>
  );
}
