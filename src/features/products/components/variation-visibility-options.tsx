// Path: src/features/products/components/variation-visibility-options.tsx
import React from "react";
import { View, Text } from "react-native";
import { Controller, Control } from "react-hook-form";
import { StatusToggle } from "@/components/common/status-toggle";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
} from "@gluestack-ui/themed";

interface VariationVisibilityOptionsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

export function VariationVisibilityOptions({
  control,
  isSubmitting,
}: VariationVisibilityOptionsProps) {
  return (
    <View className="space-y-6 py-4">
      {/* Exibir Produto */}
      <FormControl>
        <FormControlLabel>
          <Text className="text-sm font-medium text-gray-700">
            Visibilidade da Variação
          </Text>
        </FormControlLabel>
        <Controller
          control={control}
          name="exibir_produto"
          render={({ field: { onChange, value } }) => (
            <StatusToggle
              value={value}
              onChange={onChange}
              activeLabel="Variação visível na loja"
              inactiveLabel="Variação oculta (não aparece na loja)"
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
                    onChange(isNaN(numValue as any) ? null : numValue);
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
  );
}
