// Path: src/features/categories/components/category-form-modal.tsx
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  categoryFormSchema,
  CategoryFormData,
} from "../schemas/category.schema";
import { Category } from "../models/category";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Check, X } from "lucide-react-native";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
  category?: Category | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  category,
}: CategoryFormModalProps) {
  const isEditing = !!category;
  const [statusValue, setStatusValue] = useState(true);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      categoria_ativa: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  // Reset form when modal opens with category data
  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          nome: category.nome,
          categoria_ativa: category.categoria_ativa,
        });
        setStatusValue(category.categoria_ativa);
      } else {
        reset({
          nome: "",
          categoria_ativa: true,
        });
        setStatusValue(true);
      }
      setLocalIsSubmitting(false);
    }
  }, [category, reset, isOpen]);

  // Handler para o submit do formulário
  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      setLocalIsSubmitting(true);
      await onSubmit(data);
      // O fechamento do modal será gerenciado pelo componente pai
    } catch (error) {
      console.error("Erro ao submeter formulário:", error);
      setLocalIsSubmitting(false);
    }
  };

  // Determinar se o botão deve estar desabilitado
  const isButtonDisabled = isLoading || localIsSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading className="text-xl font-semibold">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </Heading>
        </ModalHeader>

        <View className="p-4 gap-4">
          {/* Nome */}
          <FormControl isInvalid={!!errors.nome}>
            <FormControlLabel>
              <FormControlLabelText className="text-sm font-medium text-gray-700">
                Nome
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    placeholder="Digite o nome da categoria"
                    onChangeText={onChange}
                    value={value || ""}
                    className="bg-white"
                  />
                </Input>
              )}
            />
            {errors.nome && (
              <FormControlError>
                <FormControlErrorText className="text-red-500">
                  {errors.nome.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Status com visual melhorado */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="text-sm font-medium text-gray-700 mb-2">
                Status da Categoria
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="categoria_ativa"
              render={({ field: { onChange, value } }) => (
                <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="sm" alignItems="center">
                      {statusValue ? (
                        <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                          <Check size={14} color="#10B981" />
                        </View>
                      ) : (
                        <View className="w-6 h-6 rounded-full bg-red-100 items-center justify-center">
                          <X size={14} color="#EF4444" />
                        </View>
                      )}
                      <Text
                        className={`font-medium ${
                          statusValue ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {statusValue ? "Ativa" : "Inativa"}
                      </Text>
                    </HStack>

                    <Switch
                      value={statusValue}
                      onValueChange={(newValue) => {
                        setStatusValue(newValue);
                        onChange(newValue);
                      }}
                      disabled={isButtonDisabled}
                      trackColor={{ false: "#EF4444", true: "#10B981" }}
                      thumbColor={statusValue ? "#ffffff" : "#ffffff"}
                    />
                  </HStack>

                  <Text className="text-xs text-gray-500 mt-2">
                    {statusValue
                      ? "A categoria estará visível para os clientes."
                      : "A categoria estará oculta e não aparecerá para os clientes."}
                  </Text>
                </View>
              )}
            />
          </FormControl>

          <View className="flex-row justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isButtonDisabled}
              className="flex-1"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isButtonDisabled}
              className="flex-1"
            >
              <ButtonText>
                {isButtonDisabled ? "Salvando..." : "Salvar"}
              </ButtonText>
            </Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
}
