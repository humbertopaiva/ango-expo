// app/(app)/admin/products/[id].tsx
import { ProductFormScreen } from "@/src/features/products/screens/product-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductFormScreen productId={id} />;
}
