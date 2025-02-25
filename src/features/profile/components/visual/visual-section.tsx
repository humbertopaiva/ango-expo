// src/features/profile/components/visual/visual-section.tsx
import React from "react";
import { View, Text } from "react-native";
import { Edit3, Palette } from "lucide-react-native";

import { useProfileContext } from "../../contexts/use-profile-context";
import { VisualForm } from "./visual-form";
import { Section } from "@/components/custom/section";
import { ImagePreview } from "@/components/custom/image-preview";

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

  return (
    <View>
      <Section
        title="Identidade Visual"
        icon={<Palette size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsVisualOpen(true)}
      >
        <View className="mb-6">
          <Text className="text-base font-medium mb-3 text-gray-800">
            Cores da Marca
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-2">
              <Text className="text-sm font-medium text-gray-700">
                Cor Primária
              </Text>
              <View className="flex-row items-center space-x-2">
                <View
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: vm.profile.cor_primaria }}
                />
                <Text className="font-mono">{vm.profile.cor_primaria}</Text>
              </View>
            </View>

            <View className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-2">
              <Text className="text-sm font-medium text-gray-700">
                Cor Secundária
              </Text>
              <View className="flex-row items-center space-x-2">
                <View
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: vm.profile.cor_secundaria }}
                />
                <Text className="font-mono">{vm.profile.cor_secundaria}</Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-base font-medium mb-3 text-gray-800">
            Galeria de Imagens
          </Text>
          <View className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <ImagePreview
                key={image.key}
                uri={vm.profile?.[image.key] as string}
                width="100%"
                height={120}
                fallbackText={image.label}
                containerClassName="aspect-square rounded-lg border border-gray-100"
              />
            ))}
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
