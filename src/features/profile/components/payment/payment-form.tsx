// Path: src/features/profile/components/payment/payment-form.tsx
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { CreditCard, Wallet } from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/custom/section-card";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
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

// Define a schema para cada opção de pagamento
const paymentOptionSchema = z.object({
  tipo: z.string(),
  ativo: z.boolean(),
});

// Define o schema completo do formulário
const formSchema = z.object({
  opcoes_pagamento: z.array(paymentOptionSchema),
});

type PaymentFormData = z.infer<typeof formSchema>;

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileDTO) => void;
  isLoading: boolean;
  profile: Profile;
}

export function PaymentForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  profile,
}: PaymentFormProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opcoes_pagamento: PAYMENT_OPTIONS.map((option) => ({
        tipo: option.id,
        ativo:
          profile.opcoes_pagamento?.find((op) => op.tipo === option.id)
            ?.ativo || false,
      })),
    },
  });

  useEffect(() => {
    if (profile && open) {
      form.reset({
        opcoes_pagamento: PAYMENT_OPTIONS.map((option) => ({
          tipo: option.id,
          ativo:
            profile.opcoes_pagamento?.find((op) => op.tipo === option.id)
              ?.ativo || false,
        })),
      });
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: PaymentFormData) => {
    const updateData: UpdateProfileDTO = {
      opcoes_pagamento: data.opcoes_pagamento,
    };
    onSubmit(updateData);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="lg"
      useRNModal={Platform.OS !== "web"}
    >
      <ModalBackdrop />
      <ModalContent
        className="max-w-4xl rounded-xl"
        style={{
          marginHorizontal: 16,
          marginVertical: 24,
          marginTop: 40,
          marginBottom: 40,
          maxHeight: "90%",
        }}
      >
        <ModalHeader className="border-b border-gray-200 px-4 py-4 flex flex-col">
          <View className="w-full flex">
            <ModalCloseButton className="justify-end items-end">
              <Icon
                as={CloseIcon}
                size="lg"
                className="stroke-primary-500 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </View>
          <Heading size="md" className="text-typography-950">
            Editar Opções de Pagamento
          </Heading>
          <Text className="text-sm text-gray-500 mt-1">
            Selecione as formas de pagamento aceitas
          </Text>
        </ModalHeader>

        <ModalBody>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 24,
              gap: 16,
            }}
          >
            <SectionCard
              title="Formas de Pagamento"
              icon={<CreditCard size={22} color={THEME_COLORS.primary} />}
            >
              <View className="flex-col py-4 gap-4">
                {PAYMENT_OPTIONS.map((option, index) => (
                  <FormControl key={option.id}>
                    <View className="flex-row items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                          <option.icon size={20} color={option.color} />
                        </View>
                        <FormControlLabel>
                          <FormControlLabelText className="text-base">
                            {option.label}
                          </FormControlLabelText>
                        </FormControlLabel>
                      </View>
                      <Controller
                        control={form.control}
                        name={`opcoes_pagamento.${index}.ativo`}
                        render={({ field: { onChange, value } }) => (
                          <Switch
                            value={value}
                            onValueChange={onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                    </View>
                  </FormControl>
                ))}
              </View>
            </SectionCard>
          </ScrollView>
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 p-4">
          <Button
            variant="outline"
            action="primary"
            onPress={onClose}
            disabled={isLoading}
            className="flex-1 mr-3"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button
            onPress={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            <ButtonText>{isLoading ? "Salvando..." : "Salvar"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
