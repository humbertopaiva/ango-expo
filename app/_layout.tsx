// app/_layout.tsx
import { View } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DrawerProvider } from "@/src/providers/drawer-provider";
import { LoadingProvider } from "@/src/providers/loading-provider";
import { Loader } from "@/components/common/loader";
import { useFonts } from "@/src/hooks/use-fonts";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isReady, error } = useFonts();

  // Retornar null enquanto as fontes estão carregando
  // Isso mantém a SplashScreen visível até que as fontes sejam carregadas
  if (!isReady && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <GluestackUIProvider config={config}>
            <DrawerProvider>
              <Loader />
              <View className="flex-1 bg-background">
                <Slot />
              </View>
            </DrawerProvider>
          </GluestackUIProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
