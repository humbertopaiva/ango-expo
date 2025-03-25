// Path: src/features/about/components/values-section.tsx
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { Users, MapPin, Leaf, Lightbulb } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface Value {
  title: string;
  description: string;
  icon?: string;
}

interface ValuesSectionProps {
  values: Value[];
}

export function ValuesSection({ values }: ValuesSectionProps) {
  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 768;
  const cardWidth = isSmallScreen ? "100%" : "50%";

  // Função para renderizar o ícone correto
  const renderIcon = (iconName?: string) => {
    const size = 28;
    const color = "#FFFFFF";

    switch (iconName) {
      case "users":
        return <Users size={size} color={color} />;
      case "map-pin":
        return <MapPin size={size} color={color} />;
      case "leaf":
        return <Leaf size={size} color={color} />;
      case "lightbulb":
        return <Lightbulb size={size} color={color} />;
      default:
        return <Lightbulb size={size} color={color} />;
    }
  };

  const getGradient = (index: number) => {
    const gradients = [
      ["#F4511E", "#FB923C"], // Orange to Light Orange
      ["#0EA5E9", "#38BDF8"], // Blue to Light Blue
      ["#22C55E", "#4ADE80"], // Green to Light Green
      ["#9333EA", "#A855F7"], // Purple to Light Purple
    ];

    return gradients[index % gradients.length];
  };

  return (
    <View className="mb-12 px-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Nossos Valores
      </Text>

      <View className="flex-row flex-wrap -mx-2">
        {values.map((value, index) => (
          <View key={index} style={{ width: cardWidth }} className="p-2">
            <View className="bg-white rounded-xl overflow-hidden shadow-md">
              <View
                className="p-3 flex-row items-center justify-between"
                style={{
                  backgroundColor: getGradient(index)[0],
                }}
              >
                <Text className="text-white font-semibold text-xl">
                  {value.title}
                </Text>
                <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
                  {renderIcon(value.icon)}
                </View>
              </View>

              <View className="p-4">
                <Text className="text-gray-700 leading-6">
                  {value.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
