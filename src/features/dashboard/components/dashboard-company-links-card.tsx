// Path: src/features/dashboard/components/dashboard-company-links-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { ExternalLink, Link } from "lucide-react-native";
import { HStack } from "@gluestack-ui/themed";
import * as Clipboard from "expo-clipboard";
import { THEME_COLORS } from "@/src/styles/colors";

interface DashboardCompanyLinksCardProps {
  slug?: string;
  primaryColor?: string;
}

export function DashboardCompanyLinksCard({
  slug,
  primaryColor = "#F4511E",
}: DashboardCompanyLinksCardProps) {
  // Função para navegar para a página de perfil da empresa no marketplace
  const navigateToProfile = () => {
    if (slug) {
      // Redirecionar para o perfil interno da empresa
      // Você precisará ajustar este caminho conforme sua navegação
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
          // Se não puder abrir, copiar para área de transferência
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

  // Função para copiar o link para a área de transferência
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

  return (
    <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <Text className="text-gray-700 font-medium mb-3">Links da Empresa</Text>
      <HStack space="md">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 rounded-lg bg-primary-50"
          onPress={navigateToProfile}
        >
          <ExternalLink size={16} color={THEME_COLORS.primary} />
          <Text className=" font-medium ml-2 text-primary-500">Ver Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-3 bg-gray-100 rounded-lg"
          onPress={navigateToLinks}
          onLongPress={copyExternalLink}
        >
          <Link size={16} color="#6B7280" />
          <Text className="text-gray-600 font-medium ml-2">Links Externos</Text>
        </TouchableOpacity>
      </HStack>
    </View>
  );
}
