// src/styles/fonts.ts
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

export function useCustomFonts() {
  const [jakartaSansLoaded] = useJakartaSans({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [delaGothicLoaded] = useDelaGothic({
    DelaGothicOne_400Regular,
  });

  return jakartaSansLoaded && delaGothicLoaded;
}
