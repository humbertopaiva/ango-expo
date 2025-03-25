// Path: src/features/about/components/mission-vision.tsx
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Target, Eye } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { LinearGradient } from "expo-linear-gradient";

interface MissionVisionProps {
  mission: string;
  vision: string;
}

export function MissionVision({ mission, vision }: MissionVisionProps) {
  const width = Dimensions.get("window").width;
  const isSmallScreen = width < 768;

  return (
    <View className="mb-8 px-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Propósito e Direção
      </Text>

      {isSmallScreen ? (
        <VStack space="lg">
          <MissionCard mission={mission} />
          <VisionCard vision={vision} />
        </VStack>
      ) : (
        <HStack space="md">
          <MissionCard mission={mission} />
          <VisionCard vision={vision} />
        </HStack>
      )}
    </View>
  );
}

function MissionCard({ mission }: { mission: string }) {
  return (
    <View className="flex-1 overflow-hidden rounded-2xl shadow-md">
      <LinearGradient
        colors={["#F4511E", "#F97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-2"
      />
      <View className="bg-white p-5">
        <HStack space="sm" alignItems="center" className="mb-3">
          <View className="bg-primary-50 w-10 h-10 rounded-full items-center justify-center">
            <Target size={20} color={THEME_COLORS.primary} />
          </View>
          <Text className="text-lg font-semibold text-primary-700">
            Nossa Missão
          </Text>
        </HStack>
        <Text className="text-gray-700 leading-6">{mission}</Text>
      </View>
    </View>
  );
}

function VisionCard({ vision }: { vision: string }) {
  return (
    <View className="flex-1 overflow-hidden rounded-2xl shadow-md">
      <LinearGradient
        colors={["#6200EE", "#9333EA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-2"
      />
      <View className="bg-white p-5">
        <HStack space="sm" alignItems="center" className="mb-3">
          <View className="bg-secondary-50 w-10 h-10 rounded-full items-center justify-center">
            <Eye size={20} color={THEME_COLORS.secondary} />
          </View>
          <Text className="text-lg font-semibold text-secondary-700">
            Nossa Visão
          </Text>
        </HStack>
        <Text className="text-gray-700 leading-6">{vision}</Text>
      </View>
    </View>
  );
}
