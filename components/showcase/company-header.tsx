// Path: src/features/commerce/components/enhanced-vitrine/CompanyHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Store,
  ArrowRight,
  ArrowRightToLine,
  SquareArrowOutUpRight,
} from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";

import { StatusBadge } from "@/components/custom/status-badge";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyWithVitrine } from "@/src/features/commerce/hooks/use-vitrine";

interface CompanyHeaderProps {
  company: CompanyWithVitrine;
  onViewAll: () => void;
}

export function CompanyHeader({ company, onViewAll }: CompanyHeaderProps) {
  // Determinar se devemos usar texto branco ou escuro com base na cor primária da empresa
  const getTextColor = (backgroundColor: string | null) => {
    if (!backgroundColor) return false;

    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  };

  const isDarkBackground = company.cor_primaria
    ? !getTextColor(company.cor_primaria)
    : false;
  const textColorClass = "text-gray-800";

  return (
    <View className="p-4 rounded-t-xl flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="h-16 w-16 rounded-xl bg-gray-100 items-center border border-gray-300 justify-center overflow-hidden">
          {company.logo ? (
            <ImagePreview
              uri={company.logo}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <Store size={24} color={"#374151"} />
          )}
        </View>

        <View className="flex-1">
          <Text className={`font-bold text-lg ${textColorClass}`}>
            {company.nome}
          </Text>

          {company.vitrineItems[0]?.empresa?.subcategorias && (
            <View className="flex-row flex-wrap mt-1 gap-1">
              {company.vitrineItems[0].empresa.subcategorias
                .slice(0, 2)
                .map((sub: any, index: number) => (
                  <View
                    key={`subcategory-${sub.subcategorias_empresas_id.id}-${index}`}
                    className="mr-1"
                  >
                    <Text
                      className={`font-medium text-xs rounded-full px-2 py-0.5 bg-gray-100  } ${textColorClass}`}
                    >
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}

              {company.vitrineItems[0].empresa.subcategorias.length > 2 && (
                <Text className={`text-xs ${textColorClass} opacity-80`}>
                  +{company.vitrineItems[0].empresa.subcategorias.length - 2}{" "}
                  mais
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={onViewAll}
        className={`flex-row items-center py-1 px-3 rounded-full bg-primary-50 aspect-square`}
      >
        <SquareArrowOutUpRight size={16} color={THEME_COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}
