// src/features/profile/components/payment/payment-section.tsx
import React from "react";
import { View, Text } from "react-native";
import { Edit3, CreditCard, Wallet } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { PaymentForm } from "./payment-form";
import { Section } from "@/components/custom/section";

const PAYMENT_OPTIONS = [
  { id: "dinheiro", label: "Dinheiro", icon: Wallet },
  { id: "pix", label: "PIX", icon: Wallet },
  { id: "cartao_credito", label: "Cartão de Crédito", icon: CreditCard },
  { id: "cartao_debito", label: "Cartão de Débito", icon: CreditCard },
  { id: "transferencia", label: "Transferência Bancária", icon: Wallet },
  { id: "boleto", label: "Boleto", icon: CreditCard },
];

export function PaymentSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const isPaymentEnabled = (tipo: string) =>
    vm.profile?.opcoes_pagamento?.find((op) => op.tipo === tipo)?.ativo ||
    false;

  return (
    <View>
      <Section
        title="Opções de Pagamento"
        icon={<CreditCard size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsPaymentOpen(true)}
      >
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_OPTIONS.map((option) => {
            const isEnabled = isPaymentEnabled(option.id);
            return (
              <View
                key={option.id}
                className="flex-row items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100"
              >
                <View className="flex-row items-center gap-3">
                  <option.icon
                    size={20}
                    color={isEnabled ? "#0891B2" : "#6B7280"}
                  />
                  <Text className="font-medium text-gray-700">
                    {option.label}
                  </Text>
                </View>
                <Badge variant={isEnabled ? "solid" : "outline"}>
                  <Text className={isEnabled ? "text-white" : "text-gray-800"}>
                    {isEnabled ? "Ativo" : "Inativo"}
                  </Text>
                </Badge>
              </View>
            );
          })}
        </View>
      </Section>

      <PaymentForm
        open={vm.isPaymentOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdatePayment}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
