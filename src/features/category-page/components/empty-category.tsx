// Path: src/features/category-page/components/empty-category.tsx
import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Store, ArrowRight } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface EmptyCategoryProps {
  categoryName: string;
  subcategoryName?: string;
}

export function EmptyCategory({
  categoryName,
  subcategoryName,
}: EmptyCategoryProps) {
  const handleWhatsAppPress = () => {
    const message = subcategoryName
      ? `Olá! Quero cadastrar minha empresa na subcategoria ${subcategoryName} (categoria ${categoryName})`
      : `Olá! Quero cadastrar minha empresa na categoria ${categoryName}`;

    Linking.openURL(
      `https://wa.me/5532988555409?text=${encodeURIComponent(message)}`
    );
  };

  // Texto adaptado com base na presença de subcategoria
  const titleText = subcategoryName
    ? `Seja o primeiro em ${subcategoryName}!`
    : "Seja o primeiro!";

  const descriptionText = subcategoryName
    ? `Não encontramos estabelecimentos na subcategoria ${subcategoryName.toLowerCase()}. Que tal ser o primeiro a aparecer aqui?`
    : `Não encontramos estabelecimentos na categoria ${categoryName.toLowerCase()}. Que tal ser o primeiro a aparecer aqui?`;

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mx-4 my-4">
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-4">
          <Store size={32} color={THEME_COLORS.primary} />
        </View>

        <Text className="text-xl font-semibold text-gray-800 text-center">
          {titleText}
        </Text>

        <Text className="text-gray-600 text-center mt-2 mb-6 font-sans">
          {descriptionText}
        </Text>

        <View
          style={styles.patternBackground}
          className="w-full bg-primary-50 rounded-xl p-4 mb-6"
        >
          <Text className="text-primary-600 font-medium text-center mb-2">
            Vantagens para seu negócio
          </Text>

          <View className="pl-4">
            <View className="flex-row items-center mb-2">
              <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
              <Text className="text-sm text-gray-700 font-sans">
                Mais visibilidade local
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
              <Text className="text-sm text-gray-700 font-sans">
                Novos clientes para seu negócio
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
              <Text className="text-sm text-gray-700 font-sans">
                Aumente suas vendas
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleWhatsAppPress}
          style={styles.button}
          className="bg-primary-500 rounded-full px-6 py-3 flex-row items-center justify-center w-full"
        >
          <Text className="text-white font-semibold mr-2">
            Cadastrar meu negócio
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        shadowColor: THEME_COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0 4px 14px ${THEME_COLORS.primary}50`,
      },
    }),
  },
  patternBackground: {
    ...Platform.select({
      web: {
        backgroundImage: `linear-gradient(to right, ${THEME_COLORS.primary}10, ${THEME_COLORS.primary}20)`,
        backgroundSize: "20px 20px",
      },
    }),
  },
});
