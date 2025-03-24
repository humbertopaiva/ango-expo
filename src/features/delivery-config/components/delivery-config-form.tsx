// Path: src/features/delivery-config/components/delivery-config-form.tsx

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import {
  Truck,
  DollarSign,
  MapPin,
  Plus,
  Settings,
  X,
} from "lucide-react-native";
import {
  deliveryConfigSchema,
  DeliveryConfigFormData,
} from "../schemas/delivery-config.schema";
import { DeliveryConfig } from "../models/delivery-config";
import { ScrollView } from "react-native";
import { Textarea, TextareaInput } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface DeliveryConfigFormProps {
  config?: DeliveryConfig | null;
  onSubmit: (data: DeliveryConfigFormData) => void;
  isLoading?: boolean;
  isSaved?: boolean;
  showSubmitButton?: boolean;
  formRef?: React.RefObject<any>;
}

export const DeliveryConfigForm = forwardRef(
  (
    {
      config,
      onSubmit,
      isLoading = false,
      isSaved = false,
      showSubmitButton = true,
      formRef,
    }: DeliveryConfigFormProps,
    ref
  ) => {
    const [newNeighborhood, setNewNeighborhood] = useState("");
    const originalValues = useRef<DeliveryConfigFormData | null>(null);

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
        mostrar_info_delivery:
          config?.mostrar_info_delivery !== undefined
            ? config.mostrar_info_delivery
            : true,
        habilitar_carrinho:
          config?.habilitar_carrinho !== undefined
            ? config.habilitar_carrinho
            : true,
      },
    });

    useEffect(() => {
      if (config && !originalValues.current) {
        const defaultValues = {
          tempo_estimado_entrega: config.tempo_estimado_entrega || 30,
          especificar_bairros_atendidos:
            config.especificar_bairros_atendidos || false,
          bairros_atendidos: config.bairros_atendidos || [],
          observacoes: config.observacoes || "",
          taxa_entrega: config.taxa_entrega || "",
          pedido_minimo: config.pedido_minimo || "",
          mostrar_info_delivery:
            config.mostrar_info_delivery !== undefined
              ? config.mostrar_info_delivery
              : true,
          habilitar_carrinho:
            config.habilitar_carrinho !== undefined
              ? config.habilitar_carrinho
              : true,
        };
        originalValues.current = defaultValues;
        Object.entries(defaultValues).forEach(([field, value]) => {
          // @ts-ignore - campo dinâmico
          setValue(field, value);
        });
      }
    }, [config]);

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

    const especificarBairros = watch("especificar_bairros_atendidos");
    const bairrosAtendidos = watch("bairros_atendidos");
    const mostrarInfoDelivery = watch("mostrar_info_delivery");

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

    const handleRemoveNeighborhood = (index: number) => {
      const currentNeighborhoods = [...(getValues("bairros_atendidos") || [])];
      currentNeighborhoods.splice(index, 1);
      setValue("bairros_atendidos", currentNeighborhoods);
    };

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 pb-24">
          {/* Configurações gerais */}
          <SectionCard
            title="Configurações Gerais"
            icon={<Settings size={22} color={THEME_COLORS.secondary} />}
          >
            <View className="gap-6 flex flex-col py-4">
              <FormControl>
                <View className="bg-gray-50 rounded-lg p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <FormControlLabel>
                        <FormControlLabelText className="text-base font-semibold text-gray-800">
                          Mostrar Informações de Delivery
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Text className="text-xs text-gray-500 mt-1">
                        Ative para exibir as informações de entrega aos clientes
                      </Text>
                    </View>
                    <Controller
                      control={control}
                      name="mostrar_info_delivery"
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          size="lg"
                          value={value}
                          onValueChange={onChange}
                          trackColor={{
                            false: "#D1D5DB",
                            true: THEME_COLORS.primary,
                          }}
                          thumbColor={value ? "#ffffff" : "#ffffff"}
                        />
                      )}
                    />
                  </View>
                </View>
              </FormControl>

              <FormControl>
                <View className="bg-gray-50 rounded-lg p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <FormControlLabel>
                        <FormControlLabelText className="text-base font-semibold text-gray-800">
                          Habilitar Carrinho
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Text className="text-xs text-gray-500 mt-1">
                        Permita que clientes adicionem itens ao carrinho
                      </Text>
                    </View>
                    <Controller
                      control={control}
                      name="habilitar_carrinho"
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          size="lg"
                          value={value}
                          onValueChange={onChange}
                          trackColor={{
                            false: "#D1D5DB",
                            true: THEME_COLORS.primary,
                          }}
                          thumbColor={value ? "#ffffff" : "#ffffff"}
                        />
                      )}
                    />
                  </View>
                </View>
              </FormControl>
            </View>
          </SectionCard>

          {/* Seções de Delivery - exibidas apenas se mostrarInfoDelivery for true */}
          {mostrarInfoDelivery && (
            <>
              {/* Tempo Estimado de Entrega */}
              <SectionCard
                title="Tempo de Entrega"
                icon={<Truck size={22} color={THEME_COLORS.secondary} />}
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
                            onChangeText={(text) =>
                              onChange(parseInt(text) || 0)
                            }
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
                    <View className="flex-row items-center justify-between mb-1">
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm font-medium text-gray-700">
                          Especificar Bairros Atendidos
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        control={control}
                        name="especificar_bairros_atendidos"
                        render={({ field: { onChange, value } }) => (
                          <Switch
                            size="md"
                            value={value}
                            onValueChange={onChange}
                            trackColor={{
                              false: "#D1D5DB",
                              true: THEME_COLORS.primary,
                            }}
                            thumbColor={value ? "#ffffff" : "#ffffff"}
                          />
                        )}
                      />
                    </View>
                    <Text className="text-xs text-gray-500">
                      {especificarBairros
                        ? "Defina quais bairros são atendidos"
                        : "Todos os bairros serão atendidos"}
                    </Text>
                  </FormControl>

                  {especificarBairros && (
                    <View className="mt-2 bg-gray-50 rounded-lg p-4">
                      <Text className="text-sm font-medium text-gray-700 mb-3">
                        Bairros Atendidos
                      </Text>
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
                      <View className="space-y-2">
                        {bairrosAtendidos && bairrosAtendidos.length > 0 ? (
                          bairrosAtendidos.map((bairro, index) => (
                            <View
                              key={`${bairro}-${index}`}
                              className="flex-row justify-between items-center bg-white p-3 rounded-md border border-gray-200"
                            >
                              <Text className="text-gray-800 flex-1">
                                {bairro}
                              </Text>
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
                icon={<DollarSign size={22} color={THEME_COLORS.secondary} />}
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
                icon={<MapPin size={22} color={THEME_COLORS.secondary} />}
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
            </>
          )}
        </View>
      </ScrollView>
    );
  }
);
