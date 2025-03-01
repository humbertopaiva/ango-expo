// Path: src/features/shop-window/components/sortable-produto-item.tsx

import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  DollarSign,
  MoreVertical,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";

// Importante: Substitui TouchableOpacity por Pressable para evitar problemas com contexto de navegação
interface SortableProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SortableProdutoItem({
  produto,
  onEdit,
  onDelete,
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

  return (
    <View className="overflow-hidden relative">
      {/* Botões de ação que aparecem ao deslizar */}
      <View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-center h-full"
        style={{ width: 100 }}
      >
        <Pressable
          onPress={() => onEdit(produto)}
          className="bg-gray-100 h-full w-1/2 items-center justify-center"
        >
          <Edit size={20} color="#374151" />
        </Pressable>
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
          className={`bg-white shadow-sm border border-gray-100 overflow-hidden 
            ${!produto.disponivel ? "opacity-70" : ""}`}
        >
          {/* Posição do item como "tag" no canto superior direito */}
          {!isReordering && position && (
            <View className="absolute top-0 right-0 bg-primary-100 rounded-bl-lg px-1.5 py-0.5 z-10">
              <Text className="text-xs font-bold text-primary-700">
                #{position}
              </Text>
            </View>
          )}

          <View className="p-2 flex-row">
            {/* Área de reordenação ou imagem */}
            <View className="pr-2">
              {isReordering ? (
                <View className="h-12 w-12 bg-gray-50 rounded-lg justify-center items-center">
                  <View className="flex-row">
                    <Pressable
                      onPress={onMoveUp}
                      disabled={!onMoveUp}
                      className={`p-2 rounded-full ${
                        !onMoveUp ? "opacity-30" : "bg-white shadow-sm"
                      }`}
                    >
                      <ArrowUp size={16} color="#F4511E" />
                    </Pressable>
                    <Pressable
                      onPress={onMoveDown}
                      disabled={!onMoveDown}
                      className={`p-2 rounded-full ml-1 ${
                        !onMoveDown ? "opacity-30" : "bg-white shadow-sm"
                      }`}
                    >
                      <ArrowDown size={16} color="#F4511E" />
                    </Pressable>
                  </View>
                </View>
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
