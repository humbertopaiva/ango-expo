// app/(public)/delivery/index.tsx
import ScreenHeader from "@/components/ui/screen-header";
import { View, Text } from "react-native";

export default function DeliveryScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Delivery"
        subtitle="Peça e receba em casa"
        showBackButton={false}
      />
      <View className="flex-1 items-center justify-center p-4">
        <Text>Conteúdo do Delivery</Text>
      </View>
    </View>
  );
}
