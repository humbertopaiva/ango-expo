// Path: src/features/category-page/components/modal-filter.tsx
import React from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
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
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    padding: 8,
                    borderRadius: 9999,
                    backgroundColor: "#F3F4F6",
                  },
                ]}
              >
                <X size={20} color="#374151" />
              </Pressable>
            </HStack>
          </View>

          <ScrollView className="p-4">
            <VStack className="space-y-4">
              <Text className="text-lg font-medium text-gray-800">
                Subcategorias
              </Text>

              {/* Opção "Todas" */}
              <Pressable
                onPress={() => handleSelectSubcategory(null)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: "#F9FAFB",
                    borderWidth: 1,
                    borderColor: "#F3F4F6",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9999,
                      backgroundColor: "#E5E7EB",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Filter size={18} color={THEME_COLORS.primary} />
                  </View>
                  <Text style={{ color: "#1F2937", fontWeight: "500" }}>
                    Todas
                  </Text>
                </View>

                {selectedSubcategory === null && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 9999,
                      backgroundColor: THEME_COLORS.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={16} color="white" />
                  </View>
                )}
              </Pressable>

              {/* Lista de subcategorias */}
              {subcategories.map((subcategory) => (
                <Pressable
                  key={subcategory.id}
                  onPress={() => handleSelectSubcategory(subcategory.slug)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: "#F9FAFB",
                      borderWidth: 1,
                      borderColor: "#F3F4F6",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9999,
                        backgroundColor: "#E5E7EB",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                        overflow: "hidden",
                      }}
                    >
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
                    <Text style={{ color: "#1F2937", fontWeight: "500" }}>
                      {subcategory.nome}
                    </Text>
                  </View>

                  {selectedSubcategory === subcategory.slug && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 9999,
                        backgroundColor: THEME_COLORS.primary,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={16} color="white" />
                    </View>
                  )}
                </Pressable>
              ))}
            </VStack>
          </ScrollView>

          <View className="p-4 border-t border-gray-100">
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: THEME_COLORS.primary,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ color: "white", fontWeight: "500" }}>
                Aplicar filtros
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
