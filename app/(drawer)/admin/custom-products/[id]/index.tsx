// Path: app/(drawer)/admin/custom-products/[id]/index.tsx

import { CustomProductFormScreen } from "@/src/features/custom-products/screens/custom-product-form-screen";
import { View } from "react-native";

import { useLocalSearchParams } from "expo-router";

export default function EditCustomProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CustomProductFormScreen productId={id} />
    </View>
  );
}
