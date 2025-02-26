// Path: src/features/profile/components/visual/visual-section.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Edit3, Palette, Image as ImageIcon } from "lucide-react-native";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { VisualForm } from "./visual-form";
import { Section } from "@/components/custom/section";
import { THEME_COLORS } from "@/src/styles/colors";

export function VisualSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const images: { key: keyof typeof vm.profile; label: string }[] = [
    { key: "imagem_01", label: "Imagem 1" },
    { key: "imagem_02", label: "Imagem 2" },
    { key: "imagem_03", label: "Imagem 3" },
    { key: "imagem_04", label: "Imagem 4" },
    { key: "imagem_05", label: "Imagem 5" },
    { key: "imagem_06", label: "Imagem 6" },
  ];

  // Verificar se há pelo menos uma imagem configurada
  const hasImages = images.some((img) => !!vm.profile?.[img.key]);

  return (
    <View>
      <Section
        title="Identidade Visual"
        icon={<Palette size={22} color={THEME_COLORS.secondary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsVisualOpen(true)}
      >
        <View className="gap-4">
          {/* Cores da Marca */}
          <View className="bg-white rounded-md p-4 border border-gray-100">
            <Text className="text-base font-medium mb-3 text-gray-800">
              Cores da Marca
            </Text>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <View className="p-4 rounded-lg bg-gray-50 gap-2">
                <Text className="text-sm font-medium text-gray-700">
                  Cor Primária
                </Text>
                <View className="flex-row items-center space-x-3">
                  <View
                    className="w-12 h-12 rounded-lg border border-gray-200"
                    style={{ backgroundColor: vm.profile.cor_primaria }}
                  />
                  <Text className="font-mono text-sm text-gray-700">
                    {vm.profile.cor_primaria}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Galeria de Imagens */}
          <View className="bg-white rounded-md p-4 border border-gray-100">
            <Text className="text-base font-medium mb-3 text-gray-800">
              Galeria de Imagens
            </Text>

            {hasImages ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {images.map((image) => {
                    if (!vm.profile?.[image.key]) return null;
                    return (
                      <ImagePreview
                        key={image.key}
                        uri={vm.profile?.[image.key] as string}
                        width={150}
                        height={120}
                        fallbackText={image.label}
                        containerClassName="rounded-lg border border-gray-100"
                      />
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <View className="flex-row items-center justify-center p-6 bg-gray-50 rounded-lg">
                <ImageIcon size={24} color="#9CA3AF" className="mr-2" />
                <Text className="text-gray-500 text-base">
                  Nenhuma imagem adicionada
                </Text>
              </View>
            )}
          </View>
        </View>
      </Section>

      <VisualForm
        open={vm.isVisualOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateVisual}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
