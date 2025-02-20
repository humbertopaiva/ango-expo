import React from "react";
import { View, Text } from "react-native";
import { Edit3, CreditCard, Wallet } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentForm } from "./payment-form";
import { useProfileContext } from "../../contexts/use-profile-context";

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
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Opções de Pagamento</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsPaymentOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_OPTIONS.map((option) => {
              const isEnabled = isPaymentEnabled(option.id);
              return (
                <View
                  key={option.id}
                  className="flex-row items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <View className="flex-row items-center space-x-3">
                    <option.icon
                      size={20}
                      color={isEnabled ? "#0891B2" : "#6B7280"}
                    />
                    <Text className="font-medium">{option.label}</Text>
                  </View>
                  <Badge variant={isEnabled ? "default" : "secondary"}>
                    {isEnabled ? "Ativo" : "Inativo"}
                  </Badge>
                </View>
              );
            })}
          </View>
        </View>
      </Card>

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
