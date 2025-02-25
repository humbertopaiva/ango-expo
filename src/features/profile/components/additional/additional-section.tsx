// src/features/profile/components/additional/additional-section.tsx
import React from "react";
import { View, Text } from "react-native";
import { Edit3, Tag, Info } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { AdditionalForm } from "./additional-form";
import { Section } from "@/components/custom/section";

export function AdditionalSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  return (
    <View>
      <Section
        title="Informações Adicionais"
        icon={<Info size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsAdditionalOpen(true)}
      >
        {/* Adicionais */}
        <View className="mb-6">
          <View className="flex-row items-center space-x-2 mb-4">
            <Info size={20} color="#6B7280" />
            <Text className="font-medium text-gray-800">
              Informações Extras
            </Text>
          </View>

          {vm.profile.adicionais && vm.profile.adicionais.length > 0 ? (
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vm.profile.adicionais.map((adicional, index) => (
                <View
                  key={index}
                  className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-1"
                >
                  <Text className="font-medium text-gray-700">
                    {adicional.titulo}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {adicional.valor}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 p-4 border border-gray-100 bg-gray-50 rounded-lg">
              Nenhuma informação adicional cadastrada.
            </Text>
          )}
        </View>

        {/* Tags */}
        <View>
          <View className="flex-row items-center space-x-2 mb-4">
            <Tag size={20} color="#6B7280" />
            <Text className="font-medium text-gray-800">Tags</Text>
          </View>

          {vm.profile.tags && vm.profile.tags.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 p-4 border border-gray-100 bg-gray-50 rounded-lg">
              {vm.profile.tags.map((tag, index) => (
                <Badge key={index} variant="solid" className="bg-primary-100">
                  <Text className="text-primary-800">{tag}</Text>
                </Badge>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 p-4 border border-gray-100 bg-gray-50 rounded-lg">
              Nenhuma tag cadastrada.
            </Text>
          )}
        </View>
      </Section>

      <AdditionalForm
        open={vm.isAdditionalOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateAdditional}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
