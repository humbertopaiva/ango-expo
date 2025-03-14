// app/(app)/admin/products/[id].tsx
import ScreenHeader from "@/components/ui/screen-header";
import { ProductFormScreen } from "@/src/features/products/screens/product-form-screen";
import { View } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Editar Produto" backTo="/admin/products" />
      <ProductFormScreen productId={id} />
    </View>
  );
}
