// src/features/auth/components/login-form.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { Mail, Lock } from "lucide-react-native";
import { IAuthViewModel } from "../view-models/auth.view-model.interface";

interface LoginFormProps {
  viewModel: IAuthViewModel;
}

export function LoginForm({ viewModel }: LoginFormProps) {
  const { form, isLoading, onSubmit } = viewModel;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <View className="w-full max-w-sm space-y-8">
      {/* Header */}
      <View className="space-y-2 mb-8">
        <Text className="text-2xl font-bold text-center text-gray-900">
          Login
        </Text>
        <Text className="text-sm text-center text-gray-500">
          Acesse sua conta para gerenciar sua loja
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-6 w-full">
        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="space-y-2">
              <Text className="text-sm font-medium text-gray-700">E-mail</Text>
              <View className="relative">
                <View className="absolute left-3 top-3 z-10">
                  <Mail size={20} color="#6B7280" />
                </View>
                <TextInput
                  className={`w-full h-12 pl-10 pr-4 bg-gray-50 border rounded-lg text-gray-900
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="seu@email.com"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.email && (
                <Text className="text-sm text-red-500">
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="space-y-2">
              <Text className="text-sm font-medium text-gray-700">Senha</Text>
              <View className="relative">
                <View className="absolute left-3 top-3 z-10">
                  <Lock size={20} color="#6B7280" />
                </View>
                <TextInput
                  className={`w-full h-12 pl-10 pr-4 bg-gray-50 border rounded-lg text-gray-900
                    ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  secureTextEntry
                  placeholder="Sua senha"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.password && (
                <Text className="text-sm text-red-500">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          className={`w-full h-12 rounded-lg flex items-center justify-center
            ${isLoading ? "bg-blue-300" : "bg-blue-500"}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold">
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
