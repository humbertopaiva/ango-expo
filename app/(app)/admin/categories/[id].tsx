// app/(app)/categories/[id].tsx

import { CategoryFormScreen } from "@/src/features/categories/schemas/category-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function EditCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CategoryFormScreen categoryId={id} />;
}
