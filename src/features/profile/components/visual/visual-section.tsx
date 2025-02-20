import React from "react";
import { View, Text } from "react-native";
import { Edit3, Image as ImageIcon } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";

import { useProfileContext } from "../../contexts/use-profile-context";
import { Image } from "@/components/ui/image";
import { VisualForm } from "./visual-form";

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
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Identidade Visual</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsVisualOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4 space-y-6">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <View className="p-4 rounded-lg border bg-card space-y-2">
              <Text className="text-sm font-medium">Cor Primária</Text>
              <View className="flex-row items-center space-x-2">
                <View
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: vm.profile.cor_primaria }}
                />
                <Text className="font-mono">{vm.profile.cor_primaria}</Text>
              </View>
            </View>

            <View className="p-4 rounded-lg border bg-card space-y-2">
              <Text className="text-sm font-medium">Cor Secundária</Text>
              <View className="flex-row items-center space-x-2">
                <View
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: vm.profile.cor_secundaria }}
                />
                <Text className="font-mono">{vm.profile.cor_secundaria}</Text>
              </View>
            </View>
          </View>

          <View className="space-y-4">
            <Text className="font-medium">Galeria de Imagens</Text>
            <View className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <View
                  key={image.key}
                  className="aspect-square rounded-lg border bg-gray-100 overflow-hidden"
                >
                  {vm.profile && vm.profile[image.key] ? (
                    <Image
                      source={{ uri: vm.profile[image.key] as string }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <ImageIcon size={32} color="#6B7280" />
                      <Text className="text-sm text-gray-500 mt-2">
                        {image.label}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>

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
