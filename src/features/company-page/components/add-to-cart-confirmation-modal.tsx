// Path: src/features/company-page/components/add-to-cart-confirmation-modal.tsx

import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { CheckCircle2, ShoppingBag, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { getContrastColor } from "@/src/utils/color.utils";

interface AddToCartConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  totalPrice: string;
  companySlug: string;
  variationName?: string;
  addonItems?: Array<{
    name: string;
    quantity: number;
  }>;
  customization?: {
    steps: Array<{
      name: string;
      items: string[];
    }>;
  };
  observation?: string;
  primaryColor: string;
}

export const AddToCartConfirmationModal: React.FC<
  AddToCartConfirmationModalProps
> = ({
  isVisible,
  onClose,
  productName,
  quantity,
  totalPrice,
  companySlug,
  variationName,
  addonItems,
  customization,
  observation,
  primaryColor,
}) => {
  const contrastColor = getContrastColor(primaryColor);

  const handleViewCart = () => {
    onClose();
    router.push(`/(drawer)/empresa/${companySlug}/cart`);
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-xl w-full max-w-md overflow-hidden">
          {/* Cabeçalho */}
          <View
            className="p-4 items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <CheckCircle2 size={48} color={contrastColor} className="mb-2" />
            <Text
              className="text-xl font-bold text-center"
              style={{ color: contrastColor }}
            >
              Adicionado ao Carrinho!
            </Text>
          </View>

          {/* Conteúdo */}
          <ScrollView className="max-h-80">
            <View className="p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {productName}
                {variationName && ` (${variationName})`}
              </Text>

              <HStack className="justify-between items-center mb-3">
                <Text className="text-gray-600">
                  {quantity} {quantity === 1 ? "item" : "itens"}
                </Text>
                <Text
                  className="text-lg font-bold"
                  style={{ color: primaryColor }}
                >
                  {totalPrice}
                </Text>
              </HStack>

              {/* Mostrar adicionais se existirem */}
              {addonItems && addonItems.length > 0 && (
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Adicionais:
                  </Text>
                  {addonItems.map((item, index) => (
                    <Text key={index} className="text-sm text-gray-600">
                      • {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>
              )}

              {/* Mostrar customização se existir */}
              {customization && customization.steps.length > 0 && (
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Personalização:
                  </Text>
                  {customization.steps.map((step, stepIndex) => (
                    <View key={stepIndex} className="mb-2">
                      <Text className="text-sm font-medium text-gray-600">
                        {step.name}:
                      </Text>
                      {step.items.map((item, itemIndex) => (
                        <Text key={itemIndex} className="text-sm text-gray-600">
                          • {item}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Mostrar observação se existir */}
              {observation && observation.length > 0 && (
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Observação:
                  </Text>
                  <View className="bg-gray-50 p-2 rounded-md">
                    <Text className="text-sm text-gray-600">{observation}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Botões de ação */}
          <VStack className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleViewCart}
              className="py-3 mb-2 rounded-lg items-center justify-center flex-row"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingBag size={20} color={contrastColor} className="mr-2" />
              <Text className="font-bold" style={{ color: contrastColor }}>
                Ver Carrinho
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContinueShopping}
              className="py-3 rounded-lg border items-center justify-center flex-row"
              style={{ borderColor: primaryColor }}
            >
              <Plus size={20} color={primaryColor} className="mr-2" />
              <Text className="font-bold" style={{ color: primaryColor }}>
                Continuar Comprando
              </Text>
            </TouchableOpacity>
          </VStack>
        </View>
      </View>
    </Modal>
  );
};
