// Path: src/features/profile/components/payment/payment-form.tsx

import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, UpdateProfileDTO } from "../../models/profile";
import * as z from "zod";
import {
  CreditCard,
  Wallet,
  Key,
  Mail,
  Phone,
  CreditCardIcon,
  Hash,
  AlertCircle,
} from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/custom/section-card";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
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
import { Input, InputField } from "@/components/ui/input";
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
    icon: CreditCardIcon,
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

// Tipos de chave PIX disponíveis com ícones e cores
const PIX_KEY_TYPES = [
  {
    label: "CPF/CNPJ",
    value: "cpf-cnpj",
    icon: CreditCardIcon,
    color: "#0891B2",
  },
  { label: "Email", value: "email", icon: Mail, color: "#0EA5E9" },
  { label: "Telefone", value: "telefone", icon: Phone, color: "#10B981" },
  { label: "Aleatória", value: "aleatoria", icon: Hash, color: "#7C3AED" },
];

// Schema condicional para validação da chave PIX
const formSchema = z
  .object({
    opcoes_pagamento: z.array(
      z.object({
        tipo: z.string(),
        ativo: z.boolean(),
      })
    ),
    tipo_chave_pix: z.string().nullable().optional(),
    chave_pix: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      // Verificar se PIX está ativo
      const pixEnabled = data.opcoes_pagamento.some(
        (op) => op.tipo === "pix" && op.ativo
      );

      // Se PIX estiver ativo, a chave PIX é obrigatória
      if (pixEnabled) {
        return !!data.chave_pix && data.chave_pix.trim().length > 0;
      }

      // Se PIX não estiver ativo, não precisa de validação
      return true;
    },
    {
      message:
        "É necessário informar uma chave PIX quando este método de pagamento está ativo",
      path: ["chave_pix"],
    }
  );

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
  // Estado para controlar a exibição da seção de chave PIX
  const [isPixEnabled, setIsPixEnabled] = useState(false);
  // Estado para mostrar o erro de validação da chave PIX
  const [pixValidationError, setPixValidationError] = useState<string | null>(
    null
  );

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opcoes_pagamento: PAYMENT_OPTIONS.map((option) => ({
        tipo: option.id,
        ativo:
          profile.opcoes_pagamento?.find((op) => op.tipo === option.id)
            ?.ativo || false,
      })),
      chave_pix: profile.chave_pix || "",
      tipo_chave_pix: profile.tipo_chave_pix || "cpf-cnpj",
    },
  });

  // Obtém o estado atual da opção PIX
  useEffect(() => {
    const pixOption = form
      .watch("opcoes_pagamento")
      .find((op) => op.tipo === "pix");
    setIsPixEnabled(pixOption?.ativo || false);

    // Limpa o erro de validação quando PIX é desativado
    if (!pixOption?.ativo) {
      setPixValidationError(null);
    }
  }, [form.watch("opcoes_pagamento")]);

  useEffect(() => {
    if (profile && open) {
      form.reset({
        opcoes_pagamento: PAYMENT_OPTIONS.map((option) => ({
          tipo: option.id,
          ativo:
            profile.opcoes_pagamento?.find((op) => op.tipo === option.id)
              ?.ativo || false,
        })),
        chave_pix: profile.chave_pix || "",
        tipo_chave_pix: profile.tipo_chave_pix || "cpf-cnpj",
      });

      // Verificar se PIX está ativo para mostrar os campos adicionais
      const pixOption = profile.opcoes_pagamento?.find(
        (op) => op.tipo === "pix"
      );
      setIsPixEnabled(pixOption?.ativo || false);
      setPixValidationError(null);
    }
  }, [profile, form.reset, open]);

  const handleSubmit = (data: PaymentFormData) => {
    // Verificação adicional antes de enviar
    if (isPixEnabled && (!data.chave_pix || data.chave_pix.trim() === "")) {
      setPixValidationError(
        "É necessário informar uma chave PIX quando este método de pagamento está ativo"
      );
      return;
    }

    setPixValidationError(null);

    const updateData: UpdateProfileDTO = {
      opcoes_pagamento: data.opcoes_pagamento,
      chave_pix: isPixEnabled ? data.chave_pix : null,
      tipo_chave_pix: isPixEnabled ? data.tipo_chave_pix : null,
    };

    onSubmit(updateData);
  };

  // Handler quando uma opção de pagamento é alterada
  const handlePaymentToggle = (index: number, newValue: boolean) => {
    const updatedOptions = [...form.getValues("opcoes_pagamento")];
    updatedOptions[index].ativo = newValue;

    // Se o pagamento for PIX, atualiza o estado para controlar a visibilidade
    if (updatedOptions[index].tipo === "pix") {
      setIsPixEnabled(newValue);

      // Limpa o erro de validação se o PIX for desativado
      if (!newValue) {
        setPixValidationError(null);
      }
    }

    form.setValue("opcoes_pagamento", updatedOptions);
  };

  // Escolher um tipo de chave PIX
  const handleSelectPixKeyType = (type: string) => {
    form.setValue("tipo_chave_pix", type);
  };

  // Obtém o placeholder adequado para o tipo de chave PIX selecionada
  const getPixKeyPlaceholder = () => {
    const keyType = form.watch("tipo_chave_pix");
    switch (keyType) {
      case "cpf-cnpj":
        return "Digite seu CPF ou CNPJ";
      case "email":
        return "Digite seu e-mail";
      case "telefone":
        return "+55 (DDD) NÚMERO";
      case "aleatoria":
        return "Digite sua chave aleatória";
      default:
        return "Digite sua chave PIX";
    }
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
                            onValueChange={(newValue) => {
                              onChange(newValue);
                              handlePaymentToggle(index, newValue);
                            }}
                            disabled={isLoading}
                          />
                        )}
                      />
                    </View>
                  </FormControl>
                ))}
              </View>
            </SectionCard>

            {/* Seção de configuração da chave PIX - aparece apenas se PIX estiver ativo */}
            {isPixEnabled && (
              <SectionCard
                title="Configuração da Chave PIX"
                icon={<Key size={22} color={THEME_COLORS.primary} />}
              >
                <View className="flex-col py-4 gap-4">
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText className="text-sm font-medium text-gray-700">
                        Tipo de Chave PIX
                      </FormControlLabelText>
                    </FormControlLabel>

                    {/* Grid 2x2 para os tipos de chave PIX */}
                    <View className="flex-row flex-wrap mt-2">
                      {PIX_KEY_TYPES.map((type, idx) => {
                        const isSelected =
                          form.watch("tipo_chave_pix") === type.value;
                        return (
                          <TouchableOpacity
                            key={type.value}
                            onPress={() => handleSelectPixKeyType(type.value)}
                            className={`w-1/2 p-1 mb-2`}
                            disabled={isLoading}
                          >
                            <View
                              className={`border rounded-lg p-3 items-center ${
                                isSelected
                                  ? "bg-primary-50 border-primary-200"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <View
                                className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                                  isSelected ? "bg-primary-100" : "bg-gray-50"
                                }`}
                              >
                                <type.icon
                                  size={20}
                                  color={isSelected ? type.color : "#6B7280"}
                                />
                              </View>
                              <Text
                                className={`text-sm text-center ${
                                  isSelected
                                    ? "text-primary-700 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {type.label}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!pixValidationError || !!form.formState.errors.chave_pix
                    }
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="text-sm font-medium text-gray-700">
                        Chave PIX
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      control={form.control}
                      name="chave_pix"
                      render={({ field: { onChange, value } }) => (
                        <Input>
                          <InputField
                            placeholder={getPixKeyPlaceholder()}
                            onChangeText={(text) => {
                              onChange(text);
                              // Limpa o erro de validação quando o usuário digita
                              if (text.trim() !== "") {
                                setPixValidationError(null);
                              }
                            }}
                            value={value || ""}
                            autoCapitalize="none"
                            keyboardType={
                              form.watch("tipo_chave_pix") === "email"
                                ? "email-address"
                                : "default"
                            }
                          />
                        </Input>
                      )}
                    />
                    {(pixValidationError ||
                      form.formState.errors.chave_pix) && (
                      <FormControlError>
                        <FormControlErrorText>
                          {pixValidationError ||
                            form.formState.errors.chave_pix?.message}
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                    <FormControlHelperText>
                      Esta chave será usada para receber pagamentos via PIX
                    </FormControlHelperText>
                  </FormControl>
                </View>

                {/* Mensagem de alerta para lembrar o usuário da necessidade da chave PIX */}
                <View className="mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200 flex-row items-center">
                  <AlertCircle size={20} color="#F59E0B" className="mr-2" />
                  <Text className="text-amber-800 flex-1 text-sm">
                    Para aceitar pagamentos via PIX, é necessário informar uma
                    chave válida.
                  </Text>
                </View>
              </SectionCard>
            )}
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
