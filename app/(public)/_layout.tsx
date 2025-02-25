// app/(public)/_layout.tsx
import { Stack } from "expo-router";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { PublicLayoutContainer } from "@/components/layouts/public-layout";

export default function PublicLayout() {
  return (
    <PublicLayoutContainer>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="comercio-local"
          options={{
            title: "Comércio Local",
          }}
        />
        <Stack.Screen
          name="delivery"
          options={{
            title: "Delivery",
          }}
        />
        <Stack.Screen
          name="encartes"
          options={{
            title: "Encartes",
          }}
        />
      </Stack>

      {/* Custom Tab Bar */}
      <CustomTabBar />
    </PublicLayoutContainer>
  );
}
