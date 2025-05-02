// Path: src/features/cart/components/cart-custom-product.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  Trash2,
  MinusCircle,
  PlusCircle,
  MessageSquare,
  Edit3,
  ChevronDown,
  ChevronUp,
  Package,
  Sparkles,
} from "lucide-react-native";
import { CartItem } from "../models/cart";
import { ImagePreview } from "@/components/custom/image-preview";

interface CartCustomProductProps {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateObservation: (itemId: string, observation: string) => void;
  primaryColor: string;
}

export const CartCustomProductComponent: React.FC<CartCustomProductProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateObservation,
  primaryColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempObservation, setTempObservation] = useState(
    item.observation || ""
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleSaveObservation = () => {
    onUpdateObservation(item.id, tempObservation);
    setIsEditing(false);
  };

  // Verificar se o item tem passos de personalização
  const hasCustomizations =
    !!item.customProductSteps && item.customProductSteps.length > 0;

  return (
    <Card className="mb-4 overflow-hidden shadow-sm border border-gray-100">
      <HStack space="md" className="p-3 border-b border-gray-100 bg-white">
        {/* Imagem do produto */}
        <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          <ImagePreview
            uri={item.imageUrl}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </View>

        {/* Informações do produto */}
        <VStack className="flex-1 justify-between">
          <HStack alignItems="center" space="xs">
            <Text className="font-semibold text-gray-800 text-base">
              {item.name}
            </Text>
            <View
              className="px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: primaryColor }}
              >
                Personalizado
              </Text>
            </View>
          </HStack>

          {/* Badge de produto personalizado */}
          <HStack alignItems="center" className="mt-1">
            <Sparkles size={14} color={primaryColor} />
            <Text className="text-xs text-gray-600 ml-1">
              Produto montado por você
            </Text>
          </HStack>

          <HStack className="justify-between items-center mt-1">
            <Text className="font-bold" style={{ color: primaryColor }}>
              {item.priceFormatted}
            </Text>

            {/* Controles de quantidade */}
            <HStack className="items-center">
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                style={{ opacity: item.quantity <= 1 ? 0.5 : 1 }}
              >
                <MinusCircle size={20} color={primaryColor} />
              </TouchableOpacity>

              <Text className="mx-3 font-medium text-gray-800">
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <PlusCircle size={20} color={primaryColor} />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </HStack>

      {/* Botão para exibir/ocultar detalhes de personalização */}
      {hasCustomizations && (
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          className="px-4 py-2 border-b border-gray-100 flex-row justify-between items-center bg-gray-50"
        >
          <Text className="text-sm font-medium" style={{ color: primaryColor }}>
            {showDetails ? "Ocultar detalhes" : "Ver personalização"}
          </Text>
          {showDetails ? (
            <ChevronUp size={16} color={primaryColor} />
          ) : (
            <ChevronDown size={16} color={primaryColor} />
          )}
        </TouchableOpacity>
      )}

      {/* Detalhes expandidos de personalização */}
      {showDetails && item.customProductSteps && (
        <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          {item.customProductSteps.map((step, index) => (
            <View key={index} className="mb-3">
              {step.stepName && (
                <Text className="text-xs font-medium text-gray-700 mb-1">
                  {step.stepName}:
                </Text>
              )}
              <View className="bg-white p-2 rounded-md">
                {step.selectedItems.map((selectedItem, itemIndex) => (
                  <Text key={itemIndex} className="text-sm mb-1 text-gray-700">
                    • {selectedItem.name}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Área de observação */}
      <View className="p-3 bg-gray-50">
        {isEditing ? (
          <VStack space="sm">
            <HStack className="items-center mb-1">
              <MessageSquare size={16} color={primaryColor} />
              <Text className="ml-1 text-sm font-medium text-gray-700">
                Observação:
              </Text>
            </HStack>

            <TextInput
              value={tempObservation}
              onChangeText={setTempObservation}
              placeholder="Adicione uma observação para o estabelecimento"
              multiline
              numberOfLines={2}
              className="bg-white border border-gray-200 rounded-lg p-2 text-gray-700"
              style={{ textAlignVertical: "top" }}
            />

            <HStack className="justify-end gap-2">
              <TouchableOpacity
                onPress={() => {
                  setTempObservation(item.observation || "");
                  setIsEditing(false);
                }}
                className="py-1 px-3 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveObservation}
                className="py-1 px-3 rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Text className="text-white">Salvar</Text>
              </TouchableOpacity>
            </HStack>
          </VStack>
        ) : (
          <HStack className="justify-between items-center">
            <HStack className="items-center flex-1">
              <MessageSquare size={16} color="#6B7280" />

              <Text
                className="ml-2 text-sm text-gray-500 flex-1"
                numberOfLines={1}
              >
                {item.observation ? item.observation : "Sem observações"}
              </Text>
            </HStack>

            <HStack className="gap-3">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="p-1 rounded-full"
              >
                <Edit3 size={16} color={primaryColor} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onRemove(item.id)}
                className="p-1 rounded-full"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        )}
      </View>
    </Card>
  );
};
