// Path: src/features/products/components/variation-type-form.tsx

import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  FormControl,
  FormControlErrorText,
  Input,
  InputField,
  useToast,
} from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TagInput } from "@/components/custom/tag-input";
import { Lightbulb } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

// Schema for validation
const variationTypeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  variacao: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma opção de variação"),
});

type VariationTypeFormData = z.infer<typeof variationTypeSchema>;

// Interface for the ref
export interface VariationTypeFormRef {
  handleSubmit: () => void;
}

interface VariationTypeFormProps {
  initialData?: {
    id?: string;
    nome?: string;
    variacao?: string[];
  };
  onSubmit: (data: VariationTypeFormData) => void;
  isSubmitting: boolean;
}

export const VariationTypeForm = forwardRef<
  VariationTypeFormRef,
  VariationTypeFormProps
>(({ initialData, onSubmit, isSubmitting }, ref) => {
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
        // Ensure variations are unique strings and not empty
        variacao: [...new Set(data.variacao)].filter((v) => !!v.trim()),
      });
    }),
  }));

  return (
    <View style={styles.container}>
      <FormControl isInvalid={!!form.formState.errors.nome}>
        <Text style={styles.labelText}>
          Nome do Tipo de Variação <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={form.control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <Input style={styles.inputContainer}>
              <InputField
                placeholder="Ex: Tamanho, Cor, Material"
                value={value}
                onChangeText={onChange}
                style={styles.inputField}
              />
            </Input>
          )}
        />
        {form.formState.errors.nome && (
          <FormControl.Error>
            <FormControlErrorText style={styles.errorText}>
              {form.formState.errors.nome.message}
            </FormControlErrorText>
          </FormControl.Error>
        )}
      </FormControl>

      <View style={styles.spacing} />

      <Controller
        control={form.control}
        name="variacao"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TagInput
            label="Opções de Variação"
            tags={value}
            onTagsChange={onChange}
            placeholder="Digite um valor e pressione enter (Ex: P, M, G, GG)"
            error={error?.message}
            isDisabled={isSubmitting}
          />
        )}
      />

      <View style={styles.tipCard}>
        <Lightbulb size={18} color="#92400E" style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Adicione todas as opções possíveis para este tipo de variação. Por
          exemplo, se for tamanho, adicione P, M, G, GG. Se for cor, adicione
          Azul, Vermelho, Verde, etc.
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  requiredMark: {
    color: "#EF4444",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  inputField: {
    fontSize: 14,
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
  },
  spacing: {
    height: 20,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
});
