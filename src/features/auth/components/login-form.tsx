// src/features/auth/components/login-form.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
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

  const windowWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && windowWidth >= 1024;

  const styles = StyleSheet.create({
    welcomeContainer: {
      marginBottom: 48, // 3rem
    },
    logo: {
      marginBottom: 32, // 2rem
    },
    welcomeTitle: {
      marginBottom: 16, // 1rem
    },
    formContainer: {
      marginTop: 32, // 2rem
    },
  });

  const WelcomeSection = ({ logoSize = 120 }) => (
    <View style={styles.welcomeContainer}>
      {/* Logo */}
      <View style={styles.logo} className="flex items-center justify-center">
        <Image
          source={require("@/assets/images/logo-white.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </View>

      {/* Welcome text */}
      <Text
        style={styles.welcomeTitle}
        className="text-2xl font-bold text-center text-white"
      >
        Bem-vindo de volta!
      </Text>
      <Text className="text-base text-white text-center opacity-90">
        Gerencie sua loja e acompanhe seus negócios em um só lugar.
      </Text>
    </View>
  );

  const LoginContainer = () => (
    <View
      style={styles.formContainer}
      className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg"
    >
      {/* Header */}
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center text-gray-900">
          Login
        </Text>
        <Text className="text-sm text-center text-gray-500 mt-2">
          Acesse sua conta para gerenciar sua loja
        </Text>
      </View>

      {/* Form */}
      <View className="gap-4 w-full">
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

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text className="text-center text-sm text-primary-600 my-2">
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          className={`w-full h-12 rounded-lg flex items-center justify-center
            ${isLoading ? "bg-primary-300" : "bg-primary-500"}`}
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

  if (isWideScreen) {
    return (
      <View className="flex flex-row h-screen w-full">
        {/* Left side - Colored background */}
        <View className="w-1/2 bg-primary-500 items-center justify-center px-8">
          <View className="max-w-md">
            <WelcomeSection logoSize={160} />
          </View>
        </View>

        {/* Right side - Login form */}
        <View className="w-1/2 bg-gray-50 items-center justify-center p-8">
          <LoginContainer />
        </View>
      </View>
    );
  }

  // Mobile layout with full background color
  return (
    <View className="flex-1 bg-primary-500">
      <SafeAreaView className="flex-1 w-screen h-screen">
        <View className="flex-1 items-center justify-center px-6">
          <WelcomeSection logoSize={120} />
          <LoginContainer />
        </View>
      </SafeAreaView>
    </View>
  );
}
