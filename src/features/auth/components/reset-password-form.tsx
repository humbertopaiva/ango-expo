// Path: src/features/auth/components/reset-password-form.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Controller } from "react-hook-form";
import {
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { THEME_COLORS } from "@/src/styles/colors";
import { IAuthViewModel } from "../view-models/auth.view-model.interface";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface ResetPasswordFormProps {
  viewModel: IAuthViewModel;
}

export function ResetPasswordForm({ viewModel }: ResetPasswordFormProps) {
  const {
    resetPasswordForm,
    isLoading,
    onResetPassword,
    authError,
    clearAuthError,
    resetSuccess,
  } = viewModel;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = resetPasswordForm;

  // Animações
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const errorSlideAnim = React.useRef(new Animated.Value(-100)).current;
  const errorFadeAnim = React.useRef(new Animated.Value(0)).current;
  const successFadeAnim = React.useRef(new Animated.Value(0)).current;

  // Dimensões e plataforma
  const isWeb = Platform.OS === "web";
  const isWideScreen =
    isWeb && typeof window !== "undefined" && window.innerWidth >= 1024;

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animação de erro
  useEffect(() => {
    if (authError) {
      Animated.parallel([
        Animated.timing(errorSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(errorFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-esconder o erro após 5 segundos
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(errorSlideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(errorFadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (clearAuthError) clearAuthError();
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authError]);

  // Animação de sucesso
  useEffect(() => {
    if (resetSuccess) {
      Animated.timing(successFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      successFadeAnim.setValue(0);
    }
  }, [resetSuccess]);

  const WelcomeSection = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="mb-12 relative w-full"
    >
      {/* Botão de voltar */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-0 top-0 p-2 z-10"
        style={{ marginTop: isWideScreen ? 0 : 10 }}
      >
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>

      {/* Logo */}
      <View className="flex items-center justify-center mb-8">
        <Image
          source={require("@/assets/images/logo-white.png")}
          style={{ width: 100, height: 120 }}
          resizeMode="contain"
        />
      </View>

      {/* Welcome text */}
      <Text className="text-3xl font-semibold text-center text-white mb-3">
        Recuperar Senha
      </Text>
      <Text className="text-base text-white text-center font-sans opacity-90 px-6">
        Informe seu e-mail para receber instruções de recuperação de senha.
      </Text>
    </Animated.View>
  );

  const FormContainer = () => {
    const containerAnimation = isWideScreen
      ? { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      : { opacity: fadeAnim };

    // Se o resetSuccess for true, mostra a mensagem de sucesso
    if (resetSuccess) {
      return (
        <Animated.View
          style={{ ...containerAnimation, opacity: successFadeAnim }}
          className="w-full bg-green-50 p-6 rounded-xl border border-green-200"
        >
          <View className="items-center justify-center">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Send size={32} color="#22C55E" />
            </View>
            <Text className="text-xl font-semibold text-green-800 mb-2 text-center">
              E-mail enviado com sucesso!
            </Text>
            <Text className="text-green-700 text-center mb-6">
              Verifique sua caixa de entrada e siga as instruções para recuperar
              sua senha.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-green-600 py-3 px-6 rounded-lg"
            >
              <Text className="text-white font-medium">Voltar para login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={containerAnimation}
        className={`w-full ${
          isWideScreen ? "max-w-sm p-8 rounded-2xl shadow-lg bg-white" : ""
        }`}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-semibold text-center text-gray-900">
            Recuperar Senha
          </Text>
          <Text className="text-md text-center font-sans text-gray-500 mt-2">
            Enviaremos um link para você redefinir sua senha
          </Text>
        </View>

        {/* Form */}
        <View className="gap-6 w-full mb-6">
          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Mail
                      size={20}
                      color={errors.email ? "#EF4444" : "#6B7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full h-14 pl-10 pr-4 bg-gray-50 border rounded-xl text-gray-900
                      ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="seu@email.com"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.email && (
                  <Text className="text-sm text-red-500 flex-row items-center mt-2">
                    <AlertCircle size={14} color="#EF4444" />{" "}
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <View className="mt-4">
          <TouchableOpacity
            className={`w-full rounded-xl overflow-hidden`}
            onPress={handleSubmit(onResetPassword)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[THEME_COLORS.primary, THEME_COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-14 rounded-xl items-center justify-center shadow-md"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <View className="flex-row items-center px-4">
                <Text className="text-white font-semibold mr-2 text-xl">
                  {isLoading ? "Enviando..." : "Enviar"}
                </Text>
                {!isLoading && <Send size={20} color="white" />}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Voltar para login */}
        <TouchableOpacity onPress={() => router.back()} className="mt-6">
          <Text className="text-center text-primary-600 font-medium">
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Erro animado
  const ErrorNotification = () => {
    if (!authError) return null;

    return (
      <Animated.View
        style={{
          transform: [{ translateX: errorSlideAnim }],
          opacity: errorFadeAnim,
          position: "absolute",
          top: isWideScreen ? 20 : 40,
          right: 20,
          left: isWideScreen ? "auto" : 20,
          zIndex: 1000,
        }}
        className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-md"
      >
        <View className="flex-row items-center">
          <AlertCircle size={18} color="#EF4444" />
          <Text className="ml-2 text-red-700 font-medium">{authError}</Text>
        </View>
        <TouchableOpacity
          className="absolute top-1 right-1 p-1"
          onPress={clearAuthError}
        >
          <Text className="text-red-500 font-bold">×</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isWideScreen) {
    return (
      <View className="flex flex-row h-screen w-full">
        {/* Error notification */}
        <ErrorNotification />

        {/* Left side - Colored background */}
        <View className="w-1/2 items-center justify-center relative overflow-hidden">
          {/* Gradient background */}
          <LinearGradient
            colors={[THEME_COLORS.primary, "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="absolute inset-0"
          />

          <View className="max-w-md px-8">
            <WelcomeSection />
          </View>
        </View>

        {/* Right side - Form */}
        <View className="w-1/2 bg-gray-50 items-center justify-center p-8">
          <FormContainer />
        </View>
      </View>
    );
  }

  // Mobile layout with full background color
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-primary-500"
      >
        {/* Error notification */}
        <ErrorNotification />

        <SafeAreaView className="flex-1">
          {/* Gradient background */}
          <LinearGradient
            colors={[THEME_COLORS.primary, "#F97316"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="absolute inset-0"
          />

          <View className="flex-1 items-center px-6 pt-8">
            <WelcomeSection />
            <Box className="bg-white w-full flex-1 p-8 rounded-t-xl">
              <FormContainer />
              <Box className=" flex-1 flex justify-end items-center">
                <Text className="text-sm font-medium text-gray-500">
                  Desenvolvido com ❤️ em Lima Duarte
                </Text>
              </Box>
            </Box>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
