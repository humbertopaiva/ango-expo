// Path: src/features/about/components/call-to-action.tsx
import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MessageCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CallToActionProps {
  onPress: () => void;
}

export function CallToAction({ onPress }: CallToActionProps) {
  const screenWidth = Dimensions.get("window").width;
  const isSmallScreen = screenWidth < 768;

  return (
    <View className="mb-12 mx-4">
      <LinearGradient
        colors={["#F4511E", "#F97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-3xl shadow-xl overflow-hidden"
      >
        <View className="py-8 px-6">
          <View className={`${isSmallScreen ? "" : "w-3/4 mx-auto"}`}>
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Quer fazer parte dessa história?
            </Text>

            <Text className="text-white text-center mb-8 leading-6 opacity-90">
              Junte-se ao Limei e faça parte da transformação digital do
              comércio de Lima Duarte. Vamos construir juntos um futuro mais
              próspero para nossa comunidade!
            </Text>
          </View>

          <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-full py-4 px-6 mx-auto flex-row items-center justify-center shadow-lg"
            style={{ minWidth: 200 }}
            activeOpacity={0.8}
          >
            <MessageCircle size={20} color="#F4511E" className="mr-2" />
            <Text className="font-bold text-primary-600 text-base">
              Quero fazer parte!
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
