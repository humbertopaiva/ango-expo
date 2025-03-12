// Path: src/features/checkout/screens/checkout-screen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, HStack, VStack, Divider } from "@gluestack-ui/themed";

import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import ScreenHeader from "@/components/ui/screen-header";

import { CartItem } from "@/src/features/cart/models/cart";
import { THEME_COLORS } from "@/src/styles/colors";
import { getContrastColor } from "@/src/utils/color.utils";
import { ImagePreview } from "@/components/custom/image-preview";
import { CheckoutOrderSummary } from "../components/checkout-order-summary";
import { CheckoutUserForm } from "../components/checkout-user-form";
import { CheckoutPaymentMethod } from "../components/checkout-payment-method";
import { CheckoutCompletedView } from "../components/checkout-completed-view";

export function CheckoutScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const cartVm = useCartViewModel();
  const checkoutVm = useCheckoutViewModel();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { width } = Dimensions.get("window");

  // Carregar a configuração da empresa e do checkout
  useEffect(() => {
    if (companySlug) {
      checkoutVm.loadCompanyConfig(companySlug);
    }
  }, [companySlug]);

  // Verificar se o carrinho está vazio e redirecionar se necessário
  useEffect(() => {
    if (cartVm.isEmpty) {
      Alert.alert(
        "Carrinho vazio",
        "Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.",
        [
          {
            text: "OK",
            onPress: () => router.replace(`/(drawer)/empresa/${companySlug}`),
          },
        ]
      );
    }
  }, [cartVm.isEmpty, companySlug]);

  // Manipuladores para navegação entre etapas
  const handleNextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Método para voltar à loja
  const handleBackToStore = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Finalizar pedido
  const handleFinishOrder = async () => {
    try {
      setIsProcessing(true);
      const success = await checkoutVm.finalizeOrder();

      if (success) {
        setCurrentStep(getTotalSteps()); // Avança para a tela de conclusão
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível finalizar seu pedido. Verifique as informações e tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Determinar o número total de etapas
  const getTotalSteps = () => {
    // 1: Resumo do pedido
    // 2: Informações pessoais (agora inclui endereço)
    // 3: Método de pagamento
    // 4: Confirmação
    return 4;
  };

  // Obter título da etapa atual
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Resumo do Pedido";
      case 2:
        return "Suas Informações";
      case 3:
        return "Forma de Pagamento";
      case 4:
        return "Pedido Finalizado";
      default:
        return "Checkout";
    }
  };

  // Obter subtítulo da etapa atual
  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Verifique os itens e valores";
      case 2:
        return checkoutVm.deliveryMethod === "delivery"
          ? "Dados pessoais e endereço"
          : "Dados para identificação";
      case 3:
        return "Escolha como deseja pagar";
      case 4:
        return undefined;
      default:
        return undefined;
    }
  };

  // Verificar se o botão de próximo deve estar habilitado
  const isNextButtonEnabled = () => {
    try {
      switch (currentStep) {
        case 1:
          return true; // Sempre habilitado no resumo do pedido
        case 2: {
          // Validação explícita para debug
          const valid = checkoutVm.isPersonalInfoValid();
          console.log("[DEBUG] Botão próximo etapa 2:", valid);
          return valid;
        }
        case 3: {
          const valid = checkoutVm.isPaymentValid();
          console.log("[DEBUG] Botão próximo etapa 3:", valid);
          return valid;
        }
        default:
          return false;
      }
    } catch (error) {
      console.error("[DEBUG] Erro ao verificar habilitação do botão:", error);
      return false;
    }
  };

  // Obter texto do botão de próximo
  const getNextButtonText = () => {
    switch (currentStep) {
      case 1:
        return "Continuar";
      case 2:
        return "Continuar para Pagamento";
      case 3:
        return "Finalizar Pedido";
      default:
        return "Continuar";
    }
  };

  // Verificar se devemos esconder o botão de voltar
  const shouldHideBackButton = () => {
    return currentStep === 4; // Na tela de confirmação, não há botão de voltar
  };

  // Cor primária da empresa ou padrão
  const primaryColor =
    checkoutVm.companyConfig?.primaryColor || THEME_COLORS.primary;
  const contrastTextColor = getContrastColor(primaryColor);

  // Se o carrinho estiver vazio, não renderizar o conteúdo
  if (cartVm.isEmpty) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  // Renderizar conteúdo de acordo com a etapa
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CheckoutOrderSummary />;
      case 2:
        return <CheckoutUserForm />;
      case 3:
        return <CheckoutPaymentMethod />;
      case 4:
        return <CheckoutCompletedView onBackToStore={handleBackToStore} />;
      default:
        return <View />;
    }
  };

  // Renderizar indicadores de etapas
  const renderStepIndicators = () => {
    const totalSteps = getTotalSteps() - 1; // Não contamos a última etapa (conclusão)

    return (
      <HStack className="justify-between mb-4 px-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <View
              key={`step-${stepNumber}`}
              className={`flex-1 ${index < totalSteps - 1 ? "mr-2" : ""}`}
            >
              <View
                className="h-1 rounded-full"
                style={{
                  backgroundColor:
                    isActive || isCompleted ? primaryColor : "#E5E7EB",
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.3,
                }}
              />
            </View>
          );
        })}
      </HStack>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-gray-50">
        {/* Cabeçalho */}
        <ScreenHeader
          title={getStepTitle()}
          subtitle={
            currentStep < 4
              ? getStepSubtitle() ||
                `Etapa ${currentStep} de ${getTotalSteps() - 1}`
              : undefined
          }
          showBackButton={!shouldHideBackButton()}
          onBackPress={handlePreviousStep}
        />

        {/* Indicadores de etapas */}
        {currentStep < 4 && renderStepIndicators()}

        {/* Conteúdo principal */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: currentStep < 4 ? 120 : 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Barra de navegação inferior - omitir na etapa de conclusão */}
        {currentStep < 4 && (
          <View
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            {/* Button para debug - força uma validação explícita */}
            <Button
              onPress={currentStep === 3 ? handleFinishOrder : handleNextStep}
              style={{
                backgroundColor:
                  currentStep === 1 ||
                  (currentStep === 2 && checkoutVm.isPersonalInfoValid()) ||
                  (currentStep === 3 && checkoutVm.isPaymentValid())
                    ? primaryColor
                    : "#9CA3AF", // Cinza quando desabilitado
              }}
              isDisabled={
                (currentStep === 2 && !checkoutVm.isPersonalInfoValid()) ||
                (currentStep === 3 && !checkoutVm.isPaymentValid()) ||
                isProcessing
              }
            >
              {isProcessing ? (
                <HStack space="sm" alignItems="center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold">Processando...</Text>
                </HStack>
              ) : (
                <Text className="text-white font-bold">
                  {getNextButtonText()}
                </Text>
              )}
            </Button>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
