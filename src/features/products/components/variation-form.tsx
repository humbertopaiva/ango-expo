// Path: src/features/products/components/variation-form.tsx
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text } from "react-native";
import {
  FormControl,
  FormControlLabel,
  Input,
  InputField,
  useToast,
} from "@gluestack-ui/themed";
import { TagInput } from "@/components/custom/tag-input";
import { showErrorToast } from "@/components/common/toast-helper";
import { ProductVariation } from "../models/variation";

// Interface para o ref
export interface VariationFormRef {
  handleSubmit: () => void;
}

interface VariationFormProps {
  initialData?: ProductVariation;
  onSubmit: (data: { nome: string; variacao: string[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const VariationForm = forwardRef<VariationFormRef, VariationFormProps>(
  ({ initialData, onSubmit, onCancel, isSubmitting }, ref) => {
    // Garantir que os valores iniciais sejam válidos
    const [nome, setNome] = useState(initialData?.nome || "");
    const [tags, setTags] = useState<string[]>(
      Array.isArray(initialData?.variacao) ? initialData.variacao : []
    );
    const [error, setError] = useState<{ nome?: string; tags?: string }>({});
    const toast = useToast();

    // Atualizar valores quando initialData mudar
    useEffect(() => {
      if (initialData) {
        setNome(initialData.nome || "");
        setTags(
          Array.isArray(initialData.variacao) ? initialData.variacao : []
        );
      }
    }, [initialData]);

    const validate = () => {
      const newErrors: { nome?: string; tags?: string } = {};

      if (!nome.trim()) {
        newErrors.nome = "O nome da variação é obrigatório";
      }

      if (!Array.isArray(tags) || tags.length === 0) {
        newErrors.tags = "Adicione pelo menos uma tag";
      }

      setError(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) {
        try {
          onSubmit({
            nome,
            variacao: Array.isArray(tags) ? tags : [],
          });
        } catch (err) {
          console.error("Error submitting variation form:", err);
          showErrorToast(toast, "Erro ao salvar variação");
        }
      } else {
        showErrorToast(toast, "Corrija os erros antes de enviar");
      }
    };

    // Expor o método handleSubmit para uso externo
    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    return (
      <View className="bg-white">
        {/* Form Fields */}
        <View className="space-y-4">
          <FormControl isInvalid={!!error.nome}>
            <FormControlLabel>
              <Text className="text-sm font-medium text-gray-700">
                Nome da Variação <Text className="text-red-500">*</Text>
              </Text>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Ex: Tamanho, Cor, etc."
                value={nome}
                onChangeText={setNome}
                className="bg-white"
              />
            </Input>
            {error.nome && (
              <Text className="text-red-500 text-xs mt-1">{error.nome}</Text>
            )}
          </FormControl>

          <View className="mb-4">
            <TagInput
              label="Opções de Variação"
              tags={tags}
              onTagsChange={setTags}
              placeholder="Digite uma opção e pressione enter"
              error={error.tags}
              isDisabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    );
  }
);
