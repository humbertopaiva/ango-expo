// Path: src/features/auth/screens/reset-password-screen.tsx
import React from "react";
import { View, StatusBar, Platform } from "react-native";
import { ResetPasswordForm } from "../components/reset-password-form";
import { useAuthViewModel } from "../view-models/auth.view-model";
import { THEME_COLORS } from "@/src/styles/colors";

export function ResetPasswordScreen() {
  const viewModel = useAuthViewModel();

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.primary}
      />
      <ResetPasswordForm viewModel={viewModel} />
    </View>
  );
}
