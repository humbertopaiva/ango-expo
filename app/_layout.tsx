// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Slot } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { Text, View } from "react-native";
import useAuthStore from "@/src/stores/auth";
import { useCustomFonts } from "@/src/styles/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/src/providers/toast-provider";

const queryClient = new QueryClient();

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();

  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!segments.length) return;

    if (!isAuthenticated && !inAuthGroup && segments[0] !== "(drawer)") {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(drawer)/dashboard");
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config}>
          <ToastProvider>
            <View className="flex-1 bg-background">
              <Slot />
            </View>
          </ToastProvider>
        </GluestackUIProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
