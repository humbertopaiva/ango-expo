// Path: app/(drawer)/profile/index.tsx
import { UserProfileScreen } from "@/src/features/user-profile/screens/user-profile-screen";
import React from "react";
import { View } from "react-native";

export default function UserProfilePage() {
  return (
    <View className="flex-1">
      <UserProfileScreen />
    </View>
  );
}
