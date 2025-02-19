// app/_layout.tsx
import { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Slot } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { Text, View } from "react-native";
import useAuthStore from "@/src/stores/auth";
import { useCustomFonts } from "@/src/styles/fonts";

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();

  // Move o hook para depois do carregamento das fontes
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!segments.length) return;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <GluestackUIProvider config={config}>
        <View className="flex-1 bg-background">
          <Text>Carregando fontes...</Text>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <View className="flex-1 bg-background">
        <Slot />
      </View>
    </GluestackUIProvider>
  );
}
