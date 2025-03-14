// Path: src/features/dashboard/components/dashboard-company-card.tsx
import React from "react";
import { View, Text } from "react-native";
import { User, Tag } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ResilientImage } from "@/components/common/resilient-image";
import { HStack } from "@gluestack-ui/themed";

interface SimpleDashboardCompanyCardProps {
  name: string;
  logo?: string | null;
  categoryName?: string;
  subcategoryNames?: string[];
  primaryColor?: string;
}

export function SimpleDashboardCompanyCard({
  name = "Minha Empresa",
  logo,
  categoryName,
  subcategoryNames = [],
  primaryColor = THEME_COLORS.primary,
}: SimpleDashboardCompanyCardProps) {
  // Processar subcategorias
  const displaySubcategories =
    subcategoryNames && subcategoryNames.length > 0
      ? subcategoryNames.join(", ")
      : null;

  return (
    <View className="bg-primary-500 rounded-b-2xl mb-4 shadow-md overflow-hidden">
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

            <View className="flex-row flex-wrap gap-1">
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
      </View>
    </View>
  );
}
