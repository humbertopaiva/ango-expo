// src/features/profile/components/basic-info/basic-info-section.tsx
import React from "react";
import { View, Text } from "react-native";
import { Edit3, Image as ImageIcon, Building2 } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { BasicInfoForm } from "./basic-info-form";
import { Section } from "@/components/custom/section";

export function BasicInfoSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  return (
    <View>
      <Section
        title="Informações Básicas"
        icon={<Building2 size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsBasicInfoOpen(true)}
      >
        {/* Logo e Banner */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">Logo</Text>
            <View className="overflow-hidden rounded-lg">
              <ImagePreview
                uri={vm.profile.logo}
                height={140}
                fallbackIcon={ImageIcon}
                fallbackText="Sem logo"
                containerClassName="rounded-lg border border-gray-200"
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">Banner</Text>
            <View className="overflow-hidden rounded-lg">
              <ImagePreview
                uri={vm.profile.banner}
                height={140}
                fallbackIcon={ImageIcon}
                fallbackText="Sem banner"
                resizeMode="cover"
                containerClassName="rounded-lg border border-gray-200"
              />
            </View>
          </View>
        </View>

        {/* Divisor */}
        <View className="h-px bg-gray-100 w-full my-4" />

        {/* Informações */}
        <View className="space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">Status</Text>
            <Badge
              variant={vm.profile.status === "ativo" ? "solid" : "outline"}
              className={vm.profile.status === "ativo" ? "bg-green-100" : ""}
            >
              <Text
                className={
                  vm.profile.status === "ativo"
                    ? "text-green-800"
                    : "text-gray-800"
                }
              >
                {vm.profile.status === "ativo" ? "Ativo" : "Inativo"}
              </Text>
            </Badge>
          </View>

          <View className="space-y-1">
            <Text className="text-sm font-medium text-gray-700">
              Nome da Empresa
            </Text>
            <Text className="text-base text-gray-800">{vm.profile.nome}</Text>
          </View>

          <View className="space-y-1">
            <Text className="text-sm font-medium text-gray-700">Descrição</Text>
            <Text className="text-base text-gray-600">
              {vm.profile.descricao || "Sem descrição"}
            </Text>
          </View>

          <View className="border-t border-gray-100 pt-4 mt-2">
            <View className="flex-row flex-wrap">
              <Text className="text-xs text-gray-500 mr-4">
                Criado em:{" "}
                {new Date(vm.profile.date_created).toLocaleDateString()}
              </Text>
              {vm.profile.date_updated && (
                <Text className="text-xs text-gray-500">
                  Atualizado:{" "}
                  {new Date(vm.profile.date_updated).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Section>

      <BasicInfoForm
        open={vm.isBasicInfoOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateBasicInfo}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
