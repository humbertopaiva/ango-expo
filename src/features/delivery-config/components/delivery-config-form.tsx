// src/features/delivery-config/components/delivery-config-form.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  FormControl,
  Button,
  Switch,
  VStack,
  HStack,
  TextareaInput,
  Textarea,
} from "@gluestack-ui/themed";
import {
  deliveryConfigSchema,
  DeliveryConfigFormData,
} from "../schemas/delivery-config.schema";
import { DeliveryConfig } from "../models/delivery-config";

interface DeliveryConfigFormProps {
  config?: DeliveryConfig | null;
  onSubmit: (data: DeliveryConfigFormData) => void;
  isLoading?: boolean;
}

export function DeliveryConfigForm({
  config,
  onSubmit,
  isLoading,
}: DeliveryConfigFormProps) {
  const form = useForm<DeliveryConfigFormData>({
    resolver: zodResolver(deliveryConfigSchema),
    defaultValues: {
      tempo_estimado_entrega: config?.tempo_estimado_entrega || 30,
      especificar_bairros_atendidos:
        config?.especificar_bairros_atendidos || false,
      bairros_atendidos: config?.bairros_atendidos || [],
      observacoes: config?.observacoes || "",
      taxa_entrega: config?.taxa_entrega || "",
      pedido_minimo: config?.pedido_minimo || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <ScrollView className="flex-1">
      <VStack space="lg" className="py-6">
        {/* Tempo Estimado de Entrega */}
        <FormControl isInvalid={!!errors.tempo_estimado_entrega}>
          <FormControl.Label>
            <Text className="text-sm font-medium text-gray-700">
              Tempo Estimado de Entrega (minutos)
            </Text>
          </FormControl.Label>
          <Controller
            control={control}
            name="tempo_estimado_entrega"
            render={({ field: { onChange, value } }) => (
              <Input>
                <Input.Input
                  placeholder="30"
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  value={value?.toString()}
                />
              </Input>
            )}
          />
          {errors.tempo_estimado_entrega && (
            <FormControl.Error>
              <Text className="text-sm text-red-500">
                {errors.tempo_estimado_entrega.message}
              </Text>
            </FormControl.Error>
          )}
        </FormControl>

        {/* Especificar Bairros Atendidos */}
        <FormControl>
          <FormControl.Label>
            <Text className="text-sm font-medium text-gray-700">
              Especificar Bairros Atendidos
            </Text>
          </FormControl.Label>
          <Controller
            control={control}
            name="especificar_bairros_atendidos"
            render={({ field: { onChange, value } }) => (
              <HStack space="md" alignItems="center">
                <Switch value={value} onValueChange={onChange} />
                <Text className="text-sm text-gray-600">
                  {value
                    ? "Especificar bairros atendidos"
                    : "Todos os bairros são atendidos"}
                </Text>
              </HStack>
            )}
          />
        </FormControl>

        {/* Taxa de Entrega */}
        <FormControl isInvalid={!!errors.taxa_entrega}>
          <FormControl.Label>
            <Text className="text-sm font-medium text-gray-700">
              Taxa de Entrega
            </Text>
          </FormControl.Label>
          <Controller
            control={control}
            name="taxa_entrega"
            render={({ field: { onChange, value } }) => (
              <Input>
                <Input.Input
                  placeholder="R$ 0,00"
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
          {errors.taxa_entrega && (
            <FormControl.Error>
              <Text className="text-sm text-red-500">
                {errors.taxa_entrega.message}
              </Text>
            </FormControl.Error>
          )}
        </FormControl>

        {/* Pedido Mínimo */}
        <FormControl isInvalid={!!errors.pedido_minimo}>
          <FormControl.Label>
            <Text className="text-sm font-medium text-gray-700">
              Pedido Mínimo
            </Text>
          </FormControl.Label>
          <Controller
            control={control}
            name="pedido_minimo"
            render={({ field: { onChange, value } }) => (
              <Input>
                <Input.Input
                  placeholder="R$ 0,00"
                  onChangeText={onChange}
                  value={value}
                />
              </Input>
            )}
          />
          {errors.pedido_minimo && (
            <FormControl.Error>
              <Text className="text-sm text-red-500">
                {errors.pedido_minimo.message}
              </Text>
            </FormControl.Error>
          )}
        </FormControl>

        {/* Observações */}
        <FormControl isInvalid={!!errors.observacoes}>
          <FormControl.Label>
            <Text className="text-sm font-medium text-gray-700">
              Observações
            </Text>
          </FormControl.Label>
          <Controller
            control={control}
            name="observacoes"
            render={({ field: { onChange, value } }) => (
              <Textarea>
                <TextareaInput
                  placeholder="Digite observações sobre a entrega..."
                  onChangeText={onChange}
                  value={value}
                  numberOfLines={4}
                />
              </Textarea>
            )}
          />
          {errors.observacoes && (
            <FormControl.Error>
              <Text className="text-sm text-red-500">
                {errors.observacoes.message}
              </Text>
            </FormControl.Error>
          )}
        </FormControl>
      </VStack>

      {/* Botões de Ação */}
      <View className="mt-6">
        <HStack space="md" justifyContent="flex-end">
          <Button
            variant="outline"
            onPress={() => {}}
            disabled={isLoading}
            className="flex-1"
          >
            <Button.Text>Cancelar</Button.Text>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            <Button.Text>{isLoading ? "Salvando..." : "Salvar"}</Button.Text>
          </Button>
        </HStack>
      </View>
    </ScrollView>
  );
}
