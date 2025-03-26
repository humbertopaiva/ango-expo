// Path: src/features/profile/screens/user-profile-screen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  VStack,
  HStack,
  Button,
  Input,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
  useToast,
} from "@gluestack-ui/themed";
import { User, Phone, MapPin, Save, Trash2 } from "lucide-react-native";
import ScreenHeader from "@/components/ui/screen-header";
import {
  PersonalInfo,
  personalInfoSchema,
} from "@/src/features/checkout/models/checkout";
import { userPersistenceService } from "@/src/services/user-persistence.service";
import { toastUtils } from "@/src/utils/toast.utils";
import { THEME_COLORS } from "@/src/styles/colors";
import { maskPhoneNumber } from "@/src/features/checkout/utils/checkout.utils";
import { router } from "expo-router";
import { useProfileViewModel } from "../view-models/use-profile-view-model";

export function UserProfileScreen() {
  const { isLoading, userData, loadUserData, saveUserData, clearUserData } =
    useProfileViewModel();
  const toast = useToast();
  const primaryColor = THEME_COLORS.primary;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      whatsapp: "",
      address: "",
      number: "",
      neighborhood: "",
      reference: "",
    },
  });

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await loadUserData();
      if (data) {
        reset(data);
      }
    };

    fetchUserData();
  }, []);

  // Confirmar limpeza de dados e chamar clearUserData
  const handleClearUserData = () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja limpar todos os seus dados pessoais?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            const success = await clearUserData();
            if (success) {
              reset({
                fullName: "",
                whatsapp: "",
                address: "",
                number: "",
                neighborhood: "",
                reference: "",
              });
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Seus dados pessoais"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView className="flex-1 p-4">
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Dados Pessoais
          </Text>

          <VStack space="md">
            {/* Nome completo */}
            <FormControl isInvalid={!!errors.fullName}>
              <FormControl.Label>
                <Text className="font-medium text-gray-700">Nome completo</Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Seu nome completo"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.fullName?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* WhatsApp com máscara */}
            <FormControl isInvalid={!!errors.whatsapp}>
              <FormControl.Label>
                <Text className="font-medium text-gray-700">WhatsApp</Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="whatsapp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Ex.: (32) 9 9999-9999"
                      value={maskPhoneNumber(value)}
                      onChangeText={(text) => {
                        // Permitir apenas números
                        const cleaned = text.replace(/\D/g, "");
                        onChange(cleaned);
                      }}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.whatsapp?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Text className="text-lg font-semibold text-gray-800 mb-1 mt-4">
              Endereço de Entrega
            </Text>

            {/* Rua */}
            <FormControl isInvalid={!!errors.address}>
              <FormControl.Label>
                <Text className="font-medium text-gray-700">Rua/Avenida</Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Ex: Rua das Flores"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.address?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Número e Bairro */}
            <HStack space="md">
              <FormControl isInvalid={!!errors.number} className="w-1/3 mr-2">
                <FormControl.Label>
                  <Text className="font-medium text-gray-700">Número</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="number"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="123"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="numeric"
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {errors.number?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.neighborhood} className="flex-1">
                <FormControl.Label>
                  <Text className="font-medium text-gray-700">Bairro</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="neighborhood"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Ex: Centro"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {errors.neighborhood?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>

            {/* Cidade (fixa) */}
            <FormControl>
              <FormControl.Label>
                <Text className="font-medium text-gray-700">Cidade</Text>
              </FormControl.Label>
              <Input isDisabled={true}>
                <InputField
                  value="Lima Duarte (MG)"
                  placeholder="Cidade"
                  className="bg-gray-100"
                />
              </Input>
            </FormControl>

            {/* Ponto de referência (opcional) */}
            <FormControl>
              <FormControl.Label>
                <Text className="font-medium text-gray-700">
                  Ponto de referência (opcional)
                </Text>
              </FormControl.Label>
              <Controller
                control={control}
                name="reference"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Ex: Próximo à padaria"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
              />
            </FormControl>
          </VStack>
        </Card>

        <HStack space="md" className="mb-8">
          <Button
            onPress={() => clearUserData()}
            variant="outline"
            className="flex-1"
            isDisabled={isLoading}
            borderColor="$red500"
          >
            <HStack space="sm" alignItems="center">
              <Trash2 size={16} color="#EF4444" />
              <Text className="text-red-500">Limpar dados</Text>
            </HStack>
          </Button>

          <Button
            onPress={handleSubmit(saveUserData)}
            style={{ backgroundColor: primaryColor }}
            className="flex-1"
            isDisabled={isLoading || !isDirty}
          >
            <HStack space="sm" alignItems="center">
              <Save size={16} color="white" />
              <Text className="text-white">Salvar</Text>
            </HStack>
          </Button>
        </HStack>
      </ScrollView>
    </View>
  );
}
