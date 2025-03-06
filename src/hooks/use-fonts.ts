// src/hooks/use-fonts.ts
import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts as useJakartaSans,
} from "@expo-google-fonts/plus-jakarta-sans";

import {
  DelaGothicOne_400Regular,
  useFonts as useDelaGothic,
} from "@expo-google-fonts/dela-gothic-one";

// Prevenir que a SplashScreen seja ocultada automaticamente
SplashScreen.preventAutoHideAsync();

export function useFonts() {
  const [jakartaSansLoaded, jakartaSansError] = useJakartaSans({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [delaGothicLoaded, delaGothicError] = useDelaGothic({
    DelaGothicOne_400Regular,
  });

  const allFontsLoaded = jakartaSansLoaded && delaGothicLoaded;
  const hasError = jakartaSansError || delaGothicError;

  useEffect(() => {
    if (allFontsLoaded || hasError) {
      // Ocultar a splash screen quando as fontes estiverem carregadas ou se houver erro
      SplashScreen.hideAsync();
    }
  }, [allFontsLoaded, hasError]);

  return {
    isReady: allFontsLoaded,
    error: hasError,
    jakartaSansLoaded,
    delaGothicLoaded,
  };
}
