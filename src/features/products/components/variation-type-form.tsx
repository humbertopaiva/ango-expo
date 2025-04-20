// Path: src/features/products/components/variation-type-form.tsx
import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text } from "react-native";
import { FormControl, Input, InputField, useToast } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TagInput } from "@/components/custom/tag-input";
import useAuthStore from "@/src/stores/auth";
import { ProductVariation } from "../models/variation";

// Schema para validação
const variationTypeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  variacao: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma opção de variação"),
});

type VariationTypeFormData = z.infer<typeof variationTypeSchema>;

// Interface para o ref
export interface VariationTypeFormRef {
  handleSubmit: () => void;
}

interface VariationTypeFormProps {
  initialData?: ProductVariation;
  onSubmit: (data: VariationTypeFormData) => void;
  isSubmitting: boolean;
}

export const VariationTypeForm = forwardRef<
  VariationTypeFormRef,
  VariationTypeFormProps
>(({ initialData, onSubmit, isSubmitting }, ref) => {
  const companyId = useAuthStore((state) => state.getCompanyId());

  const form = useForm<VariationTypeFormData>({
    resolver: zodResolver(variationTypeSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      variacao: initialData?.variacao || [],
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: form.handleSubmit((data) => {
      onSubmit({
        ...data,
        // Garantir que as variações são strings únicas e não vazias
        variacao: [...new Set(data.variacao)].filter((v) => !!v),
      });
    }),
  }));

  return (
    <View className="space-y-4">
      <FormControl isInvalid={!!form.formState.errors.nome}>
        <FormControl.Label>
          <Text className="text-sm font-medium text-gray-700">
            Nome do Tipo de Variação <Text className="text-red-500">*</Text>
          </Text>
        </FormControl.Label>
        <Controller
          control={form.control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <Input>
              <InputField
                placeholder="Ex: Tamanho, Cor, etc."
                value={value}
                onChangeText={onChange}
                className="bg-white"
              />
            </Input>
          )}
        />
        {form.formState.errors.nome && (
          <FormControl.Error>
            <FormControl.ErrorText>
              {form.formState.errors.nome.message}
            </FormControl.ErrorText>
          </FormControl.Error>
        )}
      </FormControl>

      <Controller
        control={form.control}
        name="variacao"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TagInput
            label="Opções de Variação"
            tags={value}
            onTagsChange={onChange}
            placeholder="Digite um valor e pressione enter (Ex: P, M, G)"
            error={error?.message}
            isDisabled={isSubmitting}
          />
        )}
      />
    </View>
  );
});
