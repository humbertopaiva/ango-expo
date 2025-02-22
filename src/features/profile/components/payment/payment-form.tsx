import React from "react";
import { View, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@gluestack-ui/themed";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text } from "@gluestack-ui/themed";

const PAYMENT_OPTIONS = [
  { id: "dinheiro", label: "Dinheiro" },
  { id: "pix", label: "PIX" },
  { id: "cartao_credito", label: "Cartão de Crédito" },
  { id: "cartao_debito", label: "Cartão de Débito" },
  { id: "transferencia", label: "Transferência Bancária" },
  { id: "boleto", label: "Boleto" },
];

const formSchema = z.object({
  opcoes_pagamento: z.array(
    z.object({
      tipo: z.string(),
      ativo: z.boolean(),
    })
  ),
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

  const handleSubmit = (data: PaymentFormData) => {
    const updateData: UpdateProfileDTO = {
      opcoes_pagamento: data.opcoes_pagamento,
    };
    onSubmit(updateData);
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading size="lg">
            <Text>Editar Opções de Pagamento</Text>
          </Heading>
          <Text className="text-sm text-gray-500">
            Selecione as formas de pagamento aceitas
          </Text>
        </ModalHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            {PAYMENT_OPTIONS.map((option, index) => (
              <FormControl key={option.id}>
                <View className="flex-row items-center justify-between p-4 border rounded-lg">
                  <FormControlLabel>
                    <FormControlLabelText>{option.label}</FormControlLabelText>
                  </FormControlLabel>
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

            <View className="flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
                className="flex-1"
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
            </View>
          </View>
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}
