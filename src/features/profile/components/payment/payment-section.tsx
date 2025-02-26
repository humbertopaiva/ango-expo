// Path: src/features/profile/components/payment/payment-section.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Edit3, CreditCard, Wallet } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { PaymentForm } from "./payment-form";
import { Section } from "@/components/custom/section";
import { THEME_COLORS } from "@/src/styles/colors";

const PAYMENT_OPTIONS = [
  { id: "dinheiro", label: "Dinheiro", icon: Wallet, color: "#65A30D" },
  { id: "pix", label: "PIX", icon: Wallet, color: "#0891B2" },
  {
    id: "cartao_credito",
    label: "Cartão de Crédito",
    icon: CreditCard,
    color: "#0EA5E9",
  },
  {
    id: "cartao_debito",
    label: "Cartão de Débito",
    icon: CreditCard,
    color: "#0D9488",
  },
  {
    id: "transferencia",
    label: "Transferência Bancária",
    icon: Wallet,
    color: "#7C3AED",
  },
  { id: "boleto", label: "Boleto", icon: CreditCard, color: "#F59E0B" },
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
        icon={<CreditCard size={22} color={THEME_COLORS.secondary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsPaymentOpen(true)}
      >
        <View className="gap-3">
          {PAYMENT_OPTIONS.map((option) => {
            const isEnabled = isPaymentEnabled(option.id);
            return (
              <View
                key={option.id}
                className="bg-white rounded-md p-4 flex-row items-center space-x-3 border border-gray-100"
              >
                <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                  <option.icon
                    size={20}
                    color={isEnabled ? option.color : "#6B7280"}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-700">
                    {option.label}
                  </Text>
                </View>

                <Badge
                  variant={isEnabled ? "solid" : "outline"}
                  className={isEnabled ? "bg-green-500" : ""}
                >
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
