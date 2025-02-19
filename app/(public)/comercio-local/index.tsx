// app/(public)/comercio-local/index.tsx
import ScreenHeader from "@/components/ui/screen-header";
import { View, Text } from "react-native";

export default function ComercioLocalScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Comércio Local"
        subtitle="Encontre comércios próximos a você"
        showBackButton={false}
      />
      <View className="flex-1 items-center justify-center p-4">
        <Text>Conteúdo do Comércio Local</Text>
      </View>
    </View>
  );
}
