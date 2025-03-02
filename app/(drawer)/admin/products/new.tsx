// app/(app)/admin/products/new.tsx
import ScreenHeader from "@/components/ui/screen-header";
import { ProductFormScreen } from "@/src/features/products/screens/product-form-screen";
import { View } from "@gluestack-ui/themed";

export default function NewProductsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Criar Produto" />
      <ProductFormScreen />
    </View>
  );
}
