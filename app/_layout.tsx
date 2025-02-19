import { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { config } from "@gluestack-ui/config";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/src/stores/auth";
import { useCustomFonts } from "@/src/styles/fonts";
import { View } from "react-native";

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();
  useProtectedRoute();

  if (!fontsLoaded) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
