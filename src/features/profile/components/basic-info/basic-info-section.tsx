// src/features/profile/components/basic-info/basic-info-section.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Edit3,
  Image as ImageIcon,
  Building2,
  Clock,
} from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { BasicInfoForm } from "./basic-info-form";
import { Section } from "@/components/custom/section";

export function BasicInfoSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  // Formata a data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <View>
      <Section
        title="Informações Básicas"
        icon={<Building2 size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsBasicInfoOpen(true)}
      >
        {/* Principal Card de Informações */}
        <View className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          {/* Header com nome da empresa destacado */}
          <View className="p-4 border-b border-gray-100 bg-gray-50">
            <Text className="text-xl font-bold text-gray-800">
              {vm.profile.nome}
            </Text>
          </View>

          {/* Descrição da empresa */}
          <View className="p-4">
            <Text className="text-base text-gray-600 leading-relaxed">
              {vm.profile.descricao ||
                "Sua empresa ainda não possui uma descrição. Adicione informações sobre seus produtos, serviços e diferenciais."}
            </Text>
          </View>

          {/* Datas de criação e atualização */}
          <View className="bg-gray-50 p-3 flex-row items-center justify-center border-t border-gray-100">
            {vm.profile.date_updated && (
              <View className="flex-row items-center">
                <Clock size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">
                  Atualizado: {formatDate(vm.profile.date_updated)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Cards de imagem em grid com legenda */}
        <Text className="font-medium text-base mb-3 text-gray-800">
          Imagem da marca
        </Text>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card da Logo - Agora com resizeMode="contain" */}
          <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <View className="p-3 bg-gray-50 border-b border-gray-100">
              <Text className="font-medium text-sm text-gray-700">Logo</Text>
            </View>
            <View className="p-4 bg-gray-50">
              <ImagePreview
                uri={vm.profile.logo}
                height={140}
                fallbackIcon={ImageIcon}
                fallbackText="Adicione uma logo para sua marca"
                containerClassName="rounded-lg border border-gray-200"
                resizeMode="contain" // Alterado para "contain" para preservar a proporção
              />
            </View>
          </View>

          {/* Card do Banner */}
          <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <View className="p-3 bg-gray-50 border-b border-gray-100">
              <Text className="font-medium text-sm text-gray-700">Banner</Text>
            </View>
            <View className="p-4">
              <ImagePreview
                uri={vm.profile.banner}
                height={140}
                fallbackIcon={ImageIcon}
                fallbackText="Adicione um banner para suas promoções"
                containerClassName="rounded-lg border border-gray-200"
                resizeMode="cover" // Este permanece como "cover"
              />
            </View>
          </View>
        </View>

        {/* CTA para editar se não tiver informações completas */}
        {(!vm.profile.descricao || !vm.profile.logo || !vm.profile.banner) && (
          <TouchableOpacity
            onPress={() => vm.setIsBasicInfoOpen(true)}
            className="mt-4 flex-row items-center justify-center bg-primary-50 p-4 rounded-lg border border-primary-100"
          >
            <Edit3 size={16} color="#0891B2" className="mr-2" />
            <Text className="text-primary-700 font-medium">
              Complete as informações básicas da sua loja
            </Text>
          </TouchableOpacity>
        )}
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
