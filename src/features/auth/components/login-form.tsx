// src/features/auth/components/login-form.tsx
import React, { useEffect } from "react";
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
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Controller } from "react-hook-form";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
} from "lucide-react-native";
import { IAuthViewModel } from "../view-models/auth.view-model.interface";
import { LinearGradient } from "expo-linear-gradient";
import { THEME_COLORS } from "@/src/styles/colors";
import * as Haptics from "expo-haptics";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";

interface LoginFormProps {
  viewModel: IAuthViewModel;
}

export function LoginForm({ viewModel }: LoginFormProps) {
  const { form, isLoading, onSubmit, authError, clearAuthError } = viewModel;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const isWeb = Platform.OS === "web";
  const isWideScreen = isWeb && windowWidth >= 1024;

  // Animações
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const errorSlideAnim = React.useRef(new Animated.Value(-100)).current;
  const errorFadeAnim = React.useRef(new Animated.Value(0)).current;

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

      // Feedback tátil para o erro
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

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

  const handleFormSubmit = (data: any) => {
    Keyboard.dismiss();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSubmit(data);
  };

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
        Bem-vindo de volta!
      </Text>
      <Text className="text-base text-white text-center font-sans opacity-90 px-6">
        Gerencie sua loja e acompanhe seus negócios em um só lugar.
      </Text>
    </Animated.View>
  );

  const LoginContainer = () => {
    const containerAnimation = isWideScreen
      ? { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      : { opacity: fadeAnim };

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
            Login
          </Text>
          <Text className="text-md text-center font-sans text-gray-500 mt-2">
            Acesse sua conta para gerenciar sua loja
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

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Senha
                </Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Lock
                      size={20}
                      color={errors.password ? "#EF4444" : "#6B7280"}
                    />
                  </View>
                  <TextInput
                    className={`w-full h-14 pl-10 pr-4 bg-gray-50 border rounded-xl text-gray-900
                      ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    secureTextEntry
                    placeholder="Sua senha"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.password && (
                  <Text className="text-sm text-red-500 flex-row items-center mt-2">
                    <AlertCircle size={14} color="#EF4444" />{" "}
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(auth)/reset-password")}
          >
            <Text className="text-center text-md font-medium text-primary-600 mb-2">
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button - Estilo similar ao PrimaryActionButton */}
        <View className="mt-4">
          <TouchableOpacity
            className={`w-full rounded-xl overflow-hidden`}
            onPress={handleSubmit(handleFormSubmit)}
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
                  {isLoading ? "Entrando..." : "Entrar"}
                </Text>
                {!isLoading && <ArrowRight size={20} color="white" />}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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

        {/* Right side - Login form */}
        <View className="w-1/2 bg-gray-50 items-center justify-center p-8">
          <LoginContainer />
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
              <LoginContainer />
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

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
