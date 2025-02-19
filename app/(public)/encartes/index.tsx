// app/(public)/encartes/index.tsx
import ScreenHeader from "@/components/ui/screen-header";
import { View, Text } from "react-native";

export default function EncartesScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Encartes"
        subtitle="Veja as ofertas dos comércios"
        showBackButton={false}
      />
      <View className="flex-1 items-center justify-center p-4">
        <Text>Conteúdo dos Encartes</Text>
      </View>
    </View>
  );
}
