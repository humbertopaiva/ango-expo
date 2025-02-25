// src/features/delivery-config/screens/delivery-config-content.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeliveryConfigContext } from "../contexts/use-delivery-config-context";
import { DeliveryConfigForm } from "../components/delivery-config-form";
import { Settings } from "lucide-react-native";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";

export function DeliveryConfigContent() {
  const vm = useDeliveryConfigContext();

  if (vm.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader
        title="Configurações de Entrega"
        subtitle="Gerencie as configurações de entrega da sua loja"
        showBackButton={true}
      />

      <View className="flex-1 px-4">
        <DeliveryConfigForm
          config={vm.config}
          onSubmit={vm.handleSubmit}
          isLoading={vm.isUpdating}
        />
      </View>
    </SafeAreaView>
  );
}
