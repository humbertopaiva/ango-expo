import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  Button,
  FormControl,
  Switch,
} from "@gluestack-ui/themed";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";

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
    <Dialog isOpen={open} onClose={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <Text className="text-xl font-semibold">
            Editar Opções de Pagamento
          </Text>
        </DialogHeader>

        <ScrollView className="p-4">
          <View className="space-y-4">
            {PAYMENT_OPTIONS.map((option, index) => (
              <FormControl key={option.id}>
                <View className="flex-row items-center justify-between p-4 border rounded-lg">
                  <Text className="text-base font-medium">{option.label}</Text>
                  <Controller
                    control={form.control}
                    name={`opcoes_pagamento.${index}.ativo`}
                    render={({ field: { onChange, value } }) => (
                      <Switch value={value} onValueChange={onChange} />
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
                <Button.Text>Cancelar</Button.Text>
              </Button>
              <Button
                onPress={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="flex-1"
              >
                <Button.Text>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button.Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
