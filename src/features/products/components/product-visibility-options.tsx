// Path: src/features/products/components/product-visibility-options.tsx
import React from "react";
import { View, Text } from "react-native";
import { Controller, Control } from "react-hook-form";
import { SectionCard } from "@/components/custom/section-card";
import { StatusToggle } from "@/components/common/status-toggle";
import { Eye } from "lucide-react-native";
import { ProductFormData } from "../schemas/product.schema";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from "@gluestack-ui/themed";

interface ProductVisibilityOptionsProps {
  control: Control<ProductFormData>;
  isSubmitting: boolean;
}

export function ProductVisibilityOptions({
  control,
  isSubmitting,
}: ProductVisibilityOptionsProps) {
  return (
    <SectionCard
      title="Opções de Visibilidade"
      icon={<Eye size={20} color="#374151" />}
    >
      <View className="space-y-6 py-4">
        {/* Exibir Produto */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-sm font-medium text-gray-700">
              Visibilidade do Produto
            </Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="exibir_produto"
            render={({ field: { onChange, value } }) => (
              <StatusToggle
                value={value}
                onChange={onChange}
                activeLabel="Produto visível na loja"
                inactiveLabel="Produto oculto (não aparece na loja)"
                disabled={isSubmitting}
              />
            )}
          />
        </FormControl>

        {/* Exibir Preço */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-sm font-medium text-gray-700">
              Visibilidade do Preço
            </Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="exibir_preco"
            render={({ field: { onChange, value } }) => (
              <StatusToggle
                value={value}
                onChange={onChange}
                activeLabel="Preço visível"
                inactiveLabel="Preço oculto (exibir 'Sob consulta')"
                disabled={isSubmitting}
              />
            )}
          />
        </FormControl>

        {/* Quantidade Máxima no Carrinho */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-sm font-medium text-gray-700">
              Quantidade Máxima no Carrinho
            </Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="quantidade_maxima_carrinho"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <>
                <Input>
                  <InputField
                    placeholder="Sem limite"
                    value={value !== null ? String(value) : ""}
                    onChangeText={(text) => {
                      const numValue = text === "" ? null : parseInt(text, 10);
                      onChange(isNaN(numValue) ? null : numValue);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    className="bg-white"
                  />
                </Input>
                {error && (
                  <FormControlError>
                    <FormControlErrorText>{error.message}</FormControlErrorText>
                  </FormControlError>
                )}
                <Text className="text-xs text-gray-500 mt-1">
                  Deixe em branco para não ter limite de quantidade
                </Text>
              </>
            )}
          />
        </FormControl>
      </View>
    </SectionCard>
  );
}
