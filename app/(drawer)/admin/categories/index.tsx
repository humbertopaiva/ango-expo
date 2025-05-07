// Path: app/(drawer)/admin/categories/index.tsx

import { Redirect } from "expo-router";

export default function LegacyCategoriesRedirect() {
  return <Redirect href="/admin/products/categories" />;
}
