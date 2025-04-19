// Path: src/features/profile/components/payment/payment-section.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Edit3, CreditCard, Wallet, Key } from "lucide-react-native";
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

// Mapeamento dos tipos de chave PIX para exibição
const PIX_KEY_TYPE_LABELS = {
  "cpf-cnpj": "CPF/CNPJ",
  email: "Email",
  telefone: "Telefone",
  aleatoria: "Aleatória",
};

export function PaymentSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const isPaymentEnabled = (tipo: string) =>
    vm.profile?.opcoes_pagamento?.find((op) => op.tipo === tipo)?.ativo ||
    false;

  // Verificar se o PIX está habilitado para exibir a seção de chave
  const isPixEnabled = isPaymentEnabled("pix");

  // Formatar a chave PIX para exibição (ocultar parte dela por segurança)
  const formatPixKey = (key: string | null, type: string | null) => {
    if (!key) return "";

    switch (type) {
      case "cpf-cnpj":
        // Exibe apenas os primeiros e últimos 3 dígitos
        return key.length > 6
          ? `${key.substring(0, 3)}...${key.substring(key.length - 3)}`
          : key;
      case "email":
        // Exibe parte do email antes do @ e o domínio completo
        const [username, domain] = key.split("@");
        return username && domain
          ? `${username.substring(0, 3)}...@${domain}`
          : key;
      case "telefone":
        // Exibe apenas os últimos 4 dígitos
        return key.length > 4 ? `...${key.substring(key.length - 4)}` : key;
      default:
        // Para chaves aleatórias, exibe apenas os primeiros e últimos caracteres
        return key.length > 8
          ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
          : key;
    }
  };

  return (
    <View>
      <Section
        title="Opções de Pagamento"
        icon={<CreditCard size={22} color={THEME_COLORS.primary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsPaymentOpen(true)}
        paddingX={16}
        className="my-6 flex-1 pb-20"
      >
        <View className="gap-3">
          {PAYMENT_OPTIONS.map((option) => {
            const isEnabled = isPaymentEnabled(option.id);
            return (
              <View
                key={option.id}
                className="bg-white rounded-md p-4 flex-row items-center gap-3 border border-gray-100"
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

          {/* Seção de chave PIX - exibida apenas se PIX estiver ativo */}
          {isPixEnabled && vm.profile.chave_pix && (
            <View className="bg-white rounded-md p-4 border border-gray-100">
              <View className="flex-row items-center mb-2">
                <Key size={18} color="#0891B2" className="mr-2" />
                <Text className="text-base font-medium text-gray-700">
                  Chave PIX Cadastrada
                </Text>
              </View>

              <View className="bg-gray-50 p-3 rounded-lg">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-gray-500">Tipo de Chave:</Text>
                  <Text className="text-sm font-medium">
                    {PIX_KEY_TYPE_LABELS[
                      vm.profile
                        .tipo_chave_pix as keyof typeof PIX_KEY_TYPE_LABELS
                    ] || "Não especificado"}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm text-gray-500">Chave:</Text>
                  <Text className="text-sm font-medium">
                    {formatPixKey(
                      vm.profile.chave_pix,
                      vm.profile.tipo_chave_pix
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}
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
