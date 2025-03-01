// Path: src/features/delivery-config/components/delivery-config-form.tsx

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/custom/section-card";
import { Truck, DollarSign, MapPin, Save, X, Plus } from "lucide-react-native";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import {
  deliveryConfigSchema,
  DeliveryConfigFormData,
} from "../schemas/delivery-config.schema";
import { DeliveryConfig } from "../models/delivery-config";
import { ScrollView } from "react-native";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";

interface DeliveryConfigFormProps {
  config?: DeliveryConfig | null;
  onSubmit: (data: DeliveryConfigFormData) => void;
  isLoading?: boolean;
  isSaved?: boolean;
  showSubmitButton?: boolean;
  formRef?: React.RefObject<any>;
}

// Usando forwardRef para expor os métodos do formulário
export const DeliveryConfigForm = forwardRef(
  (
    {
      config,
      onSubmit,
      isLoading = false,
      isSaved = false,
      showSubmitButton = true, // Por padrão, mostra o botão
      formRef,
    }: DeliveryConfigFormProps,
    ref
  ) => {
    // Estado para gerenciar o input de novo bairro
    const [newNeighborhood, setNewNeighborhood] = useState("");

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

    // Expõe método de submissão para o componente pai
    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        form.handleSubmit(onSubmit)();
      },
    }));

    const {
      control,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      getValues,
    } = form;

    // Observe o valor do campo de especificar bairros
    const especificarBairros = watch("especificar_bairros_atendidos");
    const bairrosAtendidos = watch("bairros_atendidos");

    // Função para adicionar um novo bairro
    const handleAddNeighborhood = () => {
      if (newNeighborhood.trim()) {
        const currentNeighborhoods = getValues("bairros_atendidos") || [];
        setValue("bairros_atendidos", [
          ...currentNeighborhoods,
          newNeighborhood.trim(),
        ]);
        setNewNeighborhood("");
      }
    };

    // Função para remover um bairro
    const handleRemoveNeighborhood = (index: number) => {
      const currentNeighborhoods = [...(getValues("bairros_atendidos") || [])];
      currentNeighborhoods.splice(index, 1);
      setValue("bairros_atendidos", currentNeighborhoods);
    };

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 pb-24">
          {/* Tempo Estimado de Entrega */}
          <SectionCard
            title="Tempo de Entrega"
            icon={<Truck size={22} color="#0891B2" />}
          >
            <View className="gap-4 flex flex-col py-4">
              <FormControl isInvalid={!!errors.tempo_estimado_entrega}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Tempo Estimado de Entrega (minutos)
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="tempo_estimado_entrega"
                  render={({ field: { onChange, value } }) => (
                    <Input variant="outline">
                      <InputField
                        placeholder="30"
                        keyboardType="numeric"
                        onChangeText={(text) => onChange(parseInt(text) || 0)}
                        value={value?.toString()}
                        className="bg-white"
                      />
                    </Input>
                  )}
                />
                {errors.tempo_estimado_entrega && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {errors.tempo_estimado_entrega.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Especificar Bairros Atendidos
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="especificar_bairros_atendidos"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center space-x-2">
                      <Switch value={value} onValueChange={onChange} />
                      <Text className="text-sm text-gray-600">
                        {value
                          ? "Especificar bairros atendidos"
                          : "Todos os bairros são atendidos"}
                      </Text>
                    </View>
                  )}
                />
              </FormControl>

              {/* Lista de bairros */}
              {especificarBairros && (
                <View className="mt-2 bg-gray-50 rounded-lg p-4">
                  <Text className="text-sm font-medium text-gray-700 mb-3">
                    Bairros Atendidos
                  </Text>

                  {/* Input para adicionar novo bairro */}
                  <View className="flex-row items-center mb-4">
                    <View className="flex-1 mr-2">
                      <Input>
                        <InputField
                          placeholder="Nome do bairro"
                          value={newNeighborhood}
                          onChangeText={setNewNeighborhood}
                          className="bg-white"
                        />
                      </Input>
                    </View>
                    <TouchableOpacity
                      onPress={handleAddNeighborhood}
                      className="bg-primary-500 p-2 rounded-lg"
                    >
                      <Plus size={20} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* Lista de bairros adicionados */}
                  <View className="space-y-2">
                    {bairrosAtendidos && bairrosAtendidos.length > 0 ? (
                      bairrosAtendidos.map((bairro, index) => (
                        <View
                          key={`${bairro}-${index}`}
                          className="flex-row justify-between items-center bg-white p-3 rounded-md border border-gray-200"
                        >
                          <Text className="text-gray-800 flex-1">{bairro}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveNeighborhood(index)}
                            className="p-1"
                          >
                            <X size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <Text className="text-gray-500 text-center py-2">
                        Nenhum bairro adicionado ainda
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </SectionCard>

          {/* Preços e Taxas */}
          <SectionCard
            title="Valores"
            icon={<DollarSign size={22} color="#0891B2" />}
          >
            <View className="gap-4 flex flex-col py-4">
              <FormControl isInvalid={!!errors.taxa_entrega}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Taxa de Entrega
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="taxa_entrega"
                  render={({ field: { onChange, value } }) => (
                    <Input variant="outline">
                      <InputField
                        placeholder="R$ 0,00"
                        onChangeText={onChange}
                        value={value}
                        className="bg-white"
                      />
                    </Input>
                  )}
                />
                {errors.taxa_entrega && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {errors.taxa_entrega.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.pedido_minimo}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Pedido Mínimo
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="pedido_minimo"
                  render={({ field: { onChange, value } }) => (
                    <Input variant="outline">
                      <InputField
                        placeholder="R$ 0,00"
                        onChangeText={onChange}
                        value={value}
                        className="bg-white"
                      />
                    </Input>
                  )}
                />
                {errors.pedido_minimo && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {errors.pedido_minimo.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
          </SectionCard>

          {/* Observações */}
          <SectionCard
            title="Informações Adicionais"
            icon={<MapPin size={22} color="#0891B2" />}
          >
            <View className="gap-4 flex flex-col py-4">
              <FormControl isInvalid={!!errors.observacoes}>
                <FormControlLabel>
                  <FormControlLabelText className="text-sm font-medium text-gray-700">
                    Observações
                  </FormControlLabelText>
                </FormControlLabel>
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
                        className="bg-white"
                        style={{
                          minHeight: 120,
                          textAlignVertical: "top",
                        }}
                      />
                    </Textarea>
                  )}
                />
                {errors.observacoes && (
                  <FormControlError>
                    <FormControlErrorText className="text-sm">
                      {errors.observacoes.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>
          </SectionCard>
        </View>
      </ScrollView>
    );
  }
);
