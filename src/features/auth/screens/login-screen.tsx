// src/features/auth/screens/login-screen.tsx
import React, { useEffect } from "react";
import { View, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "../components/login-form";
import { useAuthViewModel } from "../view-models/auth.view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { useFocusEffect } from "@react-navigation/native";

export function LoginScreen() {
  const viewModel = useAuthViewModel();

  // Usar o StatusBar com cor personalizada
  useEffect(() => {
    if (Platform.OS !== "web") {
      StatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(THEME_COLORS.primary);
      }
    }

    return () => {
      if (Platform.OS !== "web") {
        StatusBar.setBarStyle("default");
        if (Platform.OS === "android") {
          StatusBar.setBackgroundColor("transparent");
        }
      }
    };
  }, []);

  // Limpar erros de autenticação quando a tela recebe foco novamente
  useFocusEffect(
    React.useCallback(() => {
      if (viewModel.authError) {
        viewModel.clearAuthError();
      }

      return () => {};
    }, [viewModel.authError])
  );

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.primary}
      />
      <LoginForm viewModel={viewModel} />
    </View>
  );
}
