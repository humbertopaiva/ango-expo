// Path: src/features/about/components/about-header.tsx
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { THEME_COLORS } from "@/src/styles/colors";
import { Image } from "@gluestack-ui/themed";

export function AboutHeader() {
  const screenWidth = Dimensions.get("window").width;
  const imageHeight = Math.min(screenWidth * 0.6, 340);

  return (
    <View className="mb-8">
      <ImageBackground
        source={{
          uri: "https://copatruck.com.br/wp-content/uploads/2021/09/20200520124438433707o.jpg",
        }}
        className="w-full overflow-hidden"
        style={{ height: imageHeight }}
      >
        <LinearGradient
          colors={["rgba(244, 81, 30, 0.01)", "rgba(244, 81, 30, 0.95)"]}
          className="absolute inset-0"
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <View className="absolute inset-0 flex items-center justify-center">
          <View className="bg-white/90 rounded-full p-4 shadow-lg mb-4">
            <Image
              source={require("@/assets/images/limei-1.png")}
              alt="Limei Logo"
              resizeMode="contain"
              className="w-32 h-16"
            />
          </View>

          <Text className="text-white/95 text-base tracking-wider uppercase mt-1 font-medium">
            Conectando Lima Duarte
          </Text>
        </View>
      </ImageBackground>

      <View className="bg-white -mt-6 mx-4 p-6 rounded-3xl shadow-md">
        <Text className="text-primary-600 text-lg font-semibold mb-2 text-center">
          Nossa Essência
        </Text>
        <Text className="text-gray-700 text-center leading-6 ">
          Nascemos do amor por Lima Duarte e do desejo de transformar como as
          pessoas descobrem e apoiam o comércio local. Somos a ponte digital que
          conecta o melhor da nossa região a quem mais importa: nossa
          comunidade.
        </Text>
      </View>
    </View>
  );
}
