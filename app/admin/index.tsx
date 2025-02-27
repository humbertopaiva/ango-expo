// app/(app)/admin/index.tsx
import { Redirect } from "expo-router";

export default function IndexAdmin() {
  return <Redirect href="/(drawer)/dashboard" />;
}
