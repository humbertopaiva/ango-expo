// Path: src/features/dashboard/components/dashboard-company-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { User, Tag, ExternalLink, Link } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ResilientImage } from "@/components/common/resilient-image";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { HStack } from "@gluestack-ui/themed";

interface SimpleDashboardCompanyCardProps {
  name: string;
  logo?: string | null;
  categoryName?: string;
  subcategoryNames?: string[];
  primaryColor?: string;
  slug?: string;
}

export function SimpleDashboardCompanyCard({
  name = "Minha Empresa",
  logo,
  categoryName,
  subcategoryNames = [],
  primaryColor = THEME_COLORS.primary,
  slug,
}: SimpleDashboardCompanyCardProps) {
  // Função para navegar para a página de perfil da empresa no marketplace
  const navigateToProfile = () => {
    if (slug) {
      // Você pode ajustar este caminho para a rota correta do seu aplicativo
      // router.push(`/marketplace/empresa/${slug}`);
      Alert.alert("Informação", "Navegando para o perfil da empresa: " + slug);
    } else {
      Alert.alert("Informação", "O perfil público ainda não está disponível");
    }
  };

  // Função para abrir a página de links da empresa
  const navigateToLinks = async () => {
    if (slug) {
      const externalLink = `https://limei.links/${slug}`;
      try {
        const canOpen = await Linking.canOpenURL(externalLink);
        if (canOpen) {
          await Linking.openURL(externalLink);
        } else {
          // Se não puder abrir, copiar para área de transferência como fallback
          await copyExternalLink();
        }
      } catch (error) {
        console.error("Erro ao abrir link externo:", error);
        Alert.alert(
          "Erro",
          "Não foi possível abrir a página de links. O link foi copiado para a área de transferência.",
          [
            {
              text: "OK",
              onPress: () => copyExternalLink(),
            },
          ]
        );
      }
    } else {
      Alert.alert("Erro", "Não foi possível gerar o link externo");
    }
  };

  // Função para copiar o link para a área de transferência (como fallback)
  const copyExternalLink = async () => {
    if (slug) {
      const externalLink = `https://limei.links/${slug}`;
      try {
        await Clipboard.setStringAsync(externalLink);
        Alert.alert("Sucesso", "Link copiado para a área de transferência");
      } catch (error) {
        console.error("Erro ao copiar para clipboard:", error);
        if (Platform.OS === "web") {
          try {
            navigator.clipboard.writeText(externalLink);
            Alert.alert("Sucesso", "Link copiado para a área de transferência");
          } catch (webError) {
            Alert.alert("Erro", "Não foi possível copiar o link");
          }
        } else {
          Alert.alert("Erro", "Não foi possível copiar o link");
        }
      }
    }
  };

  // Processar subcategorias
  const displaySubcategories =
    subcategoryNames && subcategoryNames.length > 0
      ? subcategoryNames.join(", ")
      : null;

  return (
    <View className="bg-primary-500 rounded-b-2xl mb-4 shadow-sm overflow-hidden">
      <View className="p-4">
        {/* Conteúdo principal - layout horizontal */}
        <View className="flex-row">
          {/* Logo à esquerda */}
          <View className="w-16 h-16 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-100 items-center justify-center mr-3">
            {logo ? (
              <ResilientImage
                source={logo}
                width={60}
                height={60}
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-full h-full flex items-center justify-center rounded-md"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <User size={30} color={primaryColor} />
              </View>
            )}
          </View>

          {/* Informações da empresa à direita */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-white mb-1">
              {name}
            </Text>

            <View className="flex-row flex-wrap gap-1 mb-1">
              {/* Badge da categoria */}
              {categoryName && (
                <HStack
                  className="flex-row items-center px-2 py-1 rounded-full bg-white/90"
                  space="xs"
                >
                  <Tag size={10} color="#4B5563" />
                  <Text className="text-sm text-gray-600">{categoryName}</Text>
                </HStack>
              )}

              {/* Subcategorias */}
              {displaySubcategories && (
                <View className="flex-row items-center px-2 py-1 rounded-full bg-white/90">
                  <Text className="text-sm text-gray-500">
                    {displaySubcategories}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Botões de ação */}
        <View className="flex-row mt-3 pt-3 gap-2 border-t border-primary-400">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2 rounded-lg"
            style={{ backgroundColor: `${primaryColor}15` }}
            onPress={navigateToProfile}
          >
            <ExternalLink size={14} color={"#FFFFFF"} className="mr-1" />
            <Text className="text-md font-medium ml-2 text-white">
              Ver Perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2 bg-gray-50 rounded-lg"
            onPress={navigateToLinks}
            onLongPress={copyExternalLink} // Mantém a funcionalidade de cópia em pressão longa
          >
            <Link size={14} color="#6B7280" className="mr-1" />
            <Text className="text-md font-medium text-gray-600 ml-2">
              Página de Links
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
