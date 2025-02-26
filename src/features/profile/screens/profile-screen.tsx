// src/features/profile/screens/profile-screen.tsx
import React from "react";
import { View, Text } from "react-native";
import useAuthStore from "@/src/stores/auth";
import { ProfileProvider } from "../contexts/profile-provider";
import { ProfileContent } from "./profile-content";

export function ProfileScreen() {
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  if (!companyId) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>
          Não foi possível carregar o perfil. Tente novamente mais tarde.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ProfileProvider companyId={companyId}>
        <ProfileContent />
      </ProfileProvider>
    </View>
  );
}
