// Path: app/(drawer)/admin/products/categories/index.tsx

import { CategoriesScreen } from "@/src/features/categories/screens/categories-screen";
import { View } from "react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";

export default function CategoriesPage() {
  return (
    <View className="flex-1 bg-white">
      <CategoriesScreen />
    </View>
  );
}
