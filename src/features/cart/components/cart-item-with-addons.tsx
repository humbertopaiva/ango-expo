// Path: src/features/cart/components/cart-item-with-addons.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  Trash2,
  MessageSquare,
  Edit3,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react-native";
import { CartItem } from "../models/cart";
import { ImagePreview } from "@/components/custom/image-preview";
import { CartVariationBadge } from "./cart-variation-badge";

interface CartItemWithAddonsProps {
  item: CartItem;
  addons: CartItem[];
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateObservation: (itemId: string, observation: string) => void;
  primaryColor: string;
}

export const CartItemWithAddons: React.FC<CartItemWithAddonsProps> = ({
  item,
  addons,
  onRemove,
  onUpdateQuantity,
  onUpdateObservation,
  primaryColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempObservation, setTempObservation] = useState(
    item.observation || ""
  );
  const [showAddons, setShowAddons] = useState(false);

  // Calculate total including addons
  const calculateTotal = () => {
    let total = item.price * item.quantity;

    // Add price of addons
    addons.forEach((addon) => {
      total += addon.price * addon.quantity;
    });

    return total;
  };

  const totalPrice = calculateTotal();
  const totalPriceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);

  const handleSaveObservation = () => {
    onUpdateObservation(item.id, tempObservation);
    setIsEditing(false);
  };

  const handleRemoveWithAddons = () => {
    // First remove addons
    addons.forEach((addon) => onRemove(addon.id));
    // Then remove the main item
    onRemove(item.id);
  };

  return (
    <View className="mb-4 overflow-hidden shadow-sm rounded-lg border border-gray-100">
      {/* Item header */}
      <HStack space="md" className="p-3 border-b border-gray-100 bg-white">
        {/* Product image */}
        <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          <ImagePreview
            uri={item.imageUrl}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </View>

        {/* Product information */}
        <VStack className="flex-1 justify-between">
          <Text className="font-semibold text-gray-800 text-base">
            {item.name}
          </Text>

          {/* Display variation badge if product has variation */}
          {item.hasVariation && item.variationName && (
            <CartVariationBadge
              variationName={item.variationName}
              primaryColor={primaryColor}
            />
          )}

          {/* Optional description */}
          {!item.hasVariation && item.description && (
            <Text className="text-gray-500 text-xs" numberOfLines={1}>
              {item.description}
            </Text>
          )}

          {/* Addons indicator */}
          {addons.length > 0 && (
            <Text className="text-xs text-gray-500">
              {addons.length} {addons.length === 1 ? "adicional" : "adicionais"}{" "}
              selecionado
              {addons.length === 1 ? "" : "s"}
            </Text>
          )}

          {/* Fixed quantity display - without controls */}
          <HStack className="justify-between items-center mt-1">
            <Text className="font-bold" style={{ color: primaryColor }}>
              {item.priceFormatted}
            </Text>

            <View className="px-3 py-1 bg-gray-100 rounded-md">
              <Text className="font-medium text-gray-800">
                Qtd: {item.quantity}
              </Text>
            </View>
          </HStack>
        </VStack>
      </HStack>

      {/* Addons section */}
      {addons.length > 0 && (
        <>
          <TouchableOpacity
            onPress={() => setShowAddons(!showAddons)}
            className="px-3 py-2 bg-gray-50 border-b border-gray-100"
          >
            <HStack className="justify-between items-center">
              <Text className="text-sm font-medium text-gray-700">
                {addons.length}{" "}
                {addons.length === 1 ? "adicional" : "adicionais"} selecionado
                {addons.length === 1 ? "" : "s"}
              </Text>
              {showAddons ? (
                <ChevronUp size={16} color={primaryColor} />
              ) : (
                <ChevronDown size={16} color={primaryColor} />
              )}
            </HStack>
          </TouchableOpacity>

          {showAddons && (
            <View className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              {addons.map((addon, index) => (
                <View key={addon.id} className="mb-2">
                  <HStack className="justify-between items-center">
                    <Text className="text-sm text-gray-700">
                      {addon.quantity}x {addon.name}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      {addon.priceFormatted}
                    </Text>
                  </HStack>
                  {index < addons.length - 1 && (
                    <Divider className="my-2 bg-gray-200" />
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Price summary and total */}
      <View className="px-3 py-2 bg-gray-50 border-b border-gray-100">
        <HStack className="justify-between items-center">
          <Text className="text-sm font-medium text-gray-700">Total</Text>
          <Text className="text-sm font-bold" style={{ color: primaryColor }}>
            {totalPriceFormatted}
          </Text>
        </HStack>
      </View>

      {/* Observation area */}
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
                onPress={handleRemoveWithAddons}
                className="p-1 rounded-full"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        )}
      </View>
    </View>
  );
};
