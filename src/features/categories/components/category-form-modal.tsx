// src/features/categories/components/category-form-modal.tsx

import React, { useEffect } from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
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

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
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

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      imagem: null,
      categoria_ativa: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          nome: category.nome,
          imagem: category.imagem,
          categoria_ativa: category.categoria_ativa,
        });
      } else {
        reset({
          nome: "",
          imagem: null,
          categoria_ativa: true,
        });
      }
    }
  }, [category, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-white">
        <ModalHeader>
          <Heading className="text-xl font-semibold">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </Heading>
        </ModalHeader>

        <View className="p-4 space-y-4">
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
                    value={value}
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

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="text-sm font-medium text-gray-700">
                Status
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="categoria_ativa"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center space-x-2">
                  <Switch value={value} onValueChange={onChange} />
                  <Text className="text-sm text-gray-600">
                    {value ? "Ativa" : "Inativa"}
                  </Text>
                </View>
              )}
            />
          </FormControl>

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
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1"
            >
              <ButtonText>{isLoading ? "Salvando..." : "Salvar"}</ButtonText>
            </Button>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
}
