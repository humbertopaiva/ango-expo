// Path: src/features/category-page/components/modal-filter.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Subcategory } from "../models/subcategory";
import { X, Check, Filter } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { HStack, VStack } from "@gluestack-ui/themed";

interface ModalFilterProps {
  isVisible: boolean;
  onClose: () => void;
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string | null) => void;
}

export function ModalFilter({
  isVisible,
  onClose,
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
}: ModalFilterProps) {
  const handleSelectSubcategory = (slug: string | null) => {
    onSelectSubcategory(slug);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="bg-white rounded-t-3xl max-h-[70%]">
          <View className="p-4 border-b border-gray-100">
            <HStack className="justify-between items-center">
              <Text className="text-xl font-semibold text-gray-800">
                Filtros
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-gray-100"
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </HStack>
          </View>

          <ScrollView className="p-4">
            <VStack className="space-y-4">
              <Text className="text-lg font-medium text-gray-800">
                Subcategorias
              </Text>

              {/* Opção "Todas" */}
              <TouchableOpacity
                onPress={() => handleSelectSubcategory(null)}
                className="flex-row items-center py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <View className="flex-row flex-1 items-center">
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Filter size={18} color={THEME_COLORS.primary} />
                  </View>
                  <Text className="text-gray-800 font-medium">Todas</Text>
                </View>

                {selectedSubcategory === null && (
                  <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                    <Check size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Lista de subcategorias */}
              {subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory.id}
                  onPress={() => handleSelectSubcategory(subcategory.slug)}
                  className="flex-row items-center py-3 px-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <View className="flex-row flex-1 items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3 overflow-hidden">
                      {subcategory.imagem ? (
                        <ImagePreview
                          uri={subcategory.imagem}
                          width="100%"
                          height="100%"
                          resizeMode="cover"
                        />
                      ) : (
                        <Filter size={18} color={THEME_COLORS.primary} />
                      )}
                    </View>
                    <Text className="text-gray-800 font-medium">
                      {subcategory.nome}
                    </Text>
                  </View>

                  {selectedSubcategory === subcategory.slug && (
                    <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                      <Check size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </VStack>
          </ScrollView>

          <View className="p-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-medium">Aplicar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
