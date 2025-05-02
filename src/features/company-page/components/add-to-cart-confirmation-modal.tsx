// Path: src/features/company-page/components/add-to-cart-confirmation-modal.tsx
import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { HStack, VStack, Divider } from "@gluestack-ui/themed";
import { X, CheckCircle, ShoppingBag, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";

interface AddToCartConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  totalPrice: string;
  companySlug: string;
  variationName?: string;
  customization?: {
    steps: Array<{
      name: string;
      items: string[];
    }>;
  };
  addonItems?: Array<{
    name: string;
    quantity: number;
  }>;
  observation?: string;
  primaryColor: string;
}

export function AddToCartConfirmationModal({
  isVisible,
  onClose,
  productName,
  quantity,
  totalPrice,
  companySlug,
  variationName,
  customization,
  addonItems,
  observation,
  primaryColor,
}: AddToCartConfirmationModalProps) {
  const handleGoToCart = () => {
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
      <View className="flex-1 bg-black/60 justify-center items-center p-4">
        <View className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
            <HStack space="sm" alignItems="center">
              <CheckCircle size={20} color={primaryColor} />
              <Text className="text-lg font-bold text-gray-800">
                Adicionado ao carrinho
              </Text>
            </HStack>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="max-h-96">
            <View className="p-5">
              <HStack className="items-start justify-between mb-2">
                <VStack className="flex-1 mr-4">
                  <Text className="font-semibold text-gray-800 text-lg">
                    {productName}
                  </Text>
                  {variationName && (
                    <Text className="text-gray-600 mt-1">{variationName}</Text>
                  )}
                </VStack>
                <Text className="font-bold text-gray-800">{quantity}x</Text>
              </HStack>

              {/* Customization details */}
              {customization && customization.steps.length > 0 && (
                <View className="mt-3 mb-4 bg-gray-50 p-3 rounded-lg">
                  <Text className="font-medium text-gray-700 mb-2">
                    Personalização:
                  </Text>
                  {customization.steps.map((step, index) => (
                    <View key={index} className="mb-2">
                      <Text className="font-medium text-gray-600">
                        {step.name}:
                      </Text>
                      <Text className="text-gray-600">
                        {step.items.join(", ")}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Additional items */}
              {addonItems && addonItems.length > 0 && (
                <View className="mt-3 mb-4 bg-gray-50 p-3 rounded-lg">
                  <Text className="font-medium text-gray-700 mb-2">
                    Adicionais:
                  </Text>
                  {addonItems.map((addon, index) => (
                    <Text key={index} className="text-gray-600">
                      {addon.quantity}x {addon.name}
                    </Text>
                  ))}
                </View>
              )}

              {/* Observation */}
              {observation && observation.trim().length > 0 && (
                <View className="mt-3 mb-4 bg-gray-50 p-3 rounded-lg">
                  <Text className="font-medium text-gray-700 mb-1">
                    Observação:
                  </Text>
                  <Text className="text-gray-600">{observation}</Text>
                </View>
              )}

              <Divider className="my-3" />

              <HStack className="justify-between mb-2">
                <Text className="text-gray-600">Total</Text>
                <Text className="font-bold text-gray-800">{totalPrice}</Text>
              </HStack>
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="p-4 border-t border-gray-100">
            <HStack space="md">
              <TouchableOpacity
                onPress={handleContinueShopping}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300"
              >
                <Text className="text-center font-medium text-gray-700">
                  Continuar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGoToCart}
                className="flex-1 py-3 px-4 rounded-lg flex-row justify-center items-center"
                style={{ backgroundColor: primaryColor }}
              >
                <ShoppingBag size={18} color="white" className="mr-2" />
                <Text className="text-center font-medium text-white">
                  Ver carrinho
                </Text>
              </TouchableOpacity>
            </HStack>
          </View>
        </View>
      </View>
    </Modal>
  );
}
