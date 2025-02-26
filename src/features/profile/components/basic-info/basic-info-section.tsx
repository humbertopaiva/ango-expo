// Path: src/features/profile/components/basic-info/basic-info-section.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Edit3,
  Image as ImageIcon,
  Building2,
  Clock,
  FileText,
  Info,
} from "lucide-react-native";

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

  // Verifica se há informações incompletas
  const hasIncompleteInfo =
    !vm.profile.descricao || !vm.profile.logo || !vm.profile.banner;

  return (
    <View>
      <Section
        title="Informações Básicas"
        icon={<Building2 size={22} color="#0891B2" />}
        actionLabel="Editar Informações"
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsBasicInfoOpen(true)}
        className="mb-2"
      >
        {/* Informações Gerais - Nome e Descrição */}
        <View className="">
          {/* <View className="flex-row items-center mb-3">
            <Building2 size={18} color="#6B7280" />
            <Text className="ml-2 text-base font-medium text-gray-700">
              Informações Gerais
            </Text>
          </View> */}

          <View className="bg-white rounded-md p-4 mb-2">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {vm.profile.nome}
            </Text>

            {vm.profile.descricao ? (
              <Text className="text-base text-gray-600 leading-relaxed">
                {vm.profile.descricao}
              </Text>
            ) : (
              <View className="flex-row items-start mt-2">
                <Info size={16} color="#F59E0B" className="mr-2 mt-0.5" />
                <Text className="text-amber-700 flex-1">
                  Sua empresa ainda não possui uma descrição.
                </Text>
              </View>
            )}

            {vm.profile.date_updated && (
              <View className="flex-row items-center mt-3 pt-3 border-t border-gray-200">
                <Clock size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">
                  Atualizado: {formatDate(vm.profile.date_updated)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Imagens da Marca - Logo e Banner */}
        <View className=" bg-white rounded-md p-4 ">
          {/* <View className="flex-row items-center mb-3">
            <FileText size={18} color="#6B7280" />
            <Text className="ml-2 text-base font-medium text-gray-700">
              Imagens da Marca
            </Text>
          </View> */}

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">Logo</Text>
              <ImagePreview
                uri={vm.profile.logo}
                height={120}
                fallbackIcon={ImageIcon}
                fallbackText="Adicione uma logo"
                containerClassName="rounded-lg"
                resizeMode="contain"
              />
              {!vm.profile.logo && (
                <Text className="text-xs text-amber-600">
                  A logo identifica sua marca nas listagens
                </Text>
              )}
            </View>

            {/* Banner */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700">Banner</Text>
              <ImagePreview
                uri={vm.profile.banner}
                height={120}
                fallbackIcon={ImageIcon}
                fallbackText="Adicione um banner"
                containerClassName="rounded-lg"
                resizeMode="cover"
              />
              {!vm.profile.banner && (
                <Text className="text-xs text-amber-600">
                  O banner aparece no cabeçalho da sua página
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* CTA para completar informações se necessário */}
        {hasIncompleteInfo && (
          <TouchableOpacity
            onPress={() => vm.setIsBasicInfoOpen(true)}
            className="mt-2 py-3 flex-row items-center justify-center bg-primary-50 rounded-lg"
          >
            <Edit3 size={16} color="#0891B2" className="mr-2" />
            <Text className="text-primary-700 font-medium">
              Complete as informações básicas
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
