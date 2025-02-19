// src/features/auth/screens/login-screen.tsx
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "../components/login-form";
import { useAuthViewModel } from "../view-models/auth.view-model";

export function LoginScreen() {
  const viewModel = useAuthViewModel();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center bg-white">
        <LoginForm viewModel={viewModel} />
      </View>
    </SafeAreaView>
  );
}
