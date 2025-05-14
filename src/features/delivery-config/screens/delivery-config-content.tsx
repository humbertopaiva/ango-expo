// Path: src/features/delivery-config/screens/delivery-config-content.tsx

import React, { useRef } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeliveryConfigContext } from "../contexts/use-delivery-config-context";
import { DeliveryConfigForm } from "../components/delivery-config-form";
import { Section } from "@/components/custom/section";
import { DeliveryConfigSkeleton } from "../components/delivery-config-skeleton";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { Save } from "lucide-react-native";

export function DeliveryConfigContent() {
  const vm = useDeliveryConfigContext();
  const formRef = useRef<{ handleSubmit: () => void } | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-white pb-2" edges={["top"]}>
      <View className="flex-1">
        <Section className="flex-1">
          {vm.isLoading ? (
            <DeliveryConfigSkeleton />
          ) : (
            <DeliveryConfigForm
              ref={formRef}
              config={vm.config}
              onSubmit={vm.handleSubmit}
              isLoading={vm.isUpdating}
              isSaved={vm.isSaved}
              // Não mostrar o botão no formulário
              showSubmitButton={false}
            />
          )}
        </Section>
      </View>

      {/* Botão de ação primário - agora no componente content */}
      {!vm.isLoading && (
        <PrimaryActionButton
          onPress={() => {
            if (formRef.current) {
              formRef.current.handleSubmit();
            }
          }}
          label={
            vm.isUpdating ? "Salvando..." : vm.isSaved ? "Salvo!" : "Salvar"
          }
          icon={
            <Save
              size={20}
              color={vm.isUpdating || vm.isSaved ? "#DDDDDD" : "white"}
            />
          }
          disabled={vm.isUpdating || vm.isSaved}
          primaryColor={vm.isSaved ? "#22C55E" : undefined}
        />
      )}
    </SafeAreaView>
  );
}
