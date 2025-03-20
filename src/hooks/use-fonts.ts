// Path: src/hooks/use-fonts.ts
import { useCallback, useEffect, useState } from "react";
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
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [jakartaSansLoaded, jakartaSansError] = useJakartaSans({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [delaGothicLoaded, delaGothicError] = useDelaGothic({
    DelaGothicOne_400Regular,
  });

  useEffect(() => {
    const allFontsLoaded = jakartaSansLoaded && delaGothicLoaded;
    const anyError = jakartaSansError || delaGothicError;

    if (anyError) {
      console.error("Error loading fonts:", anyError);
      setError(anyError || new Error("Failed to load fonts"));
    }

    setFontsLoaded(allFontsLoaded);

    if (allFontsLoaded || anyError) {
      // Ocultar a splash screen quando as fontes estiverem carregadas ou se houver erro
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [jakartaSansLoaded, delaGothicLoaded, jakartaSansError, delaGothicError]);

  return {
    isReady: fontsLoaded,
    error,
    jakartaSansLoaded,
    delaGothicLoaded,
  };
}
