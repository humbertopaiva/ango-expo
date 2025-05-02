// Path: app/(drawer)/empresa/[companySlug]/profile.tsx
import React from "react";
import { View } from "react-native";
import { CompanyProfileScreen } from "@/src/features/company-page/screens/company-profile-screen";

export default function CompanyProfilePage() {
  return (
    <View className="flex-1">
      <CompanyProfileScreen />
    </View>
  );
}
