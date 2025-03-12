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
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  MapPin,
  CheckCircle,
  Phone,
  User,
  Package,
  Clipboard,
  MessageSquare,
} from "lucide-react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import ScreenHeader from "@/components/ui/screen-header";

import { CartItem } from "@/src/features/cart/models/cart";
import { THEME_COLORS } from "@/src/styles/colors";
import { getContrastColor } from "@/src/utils/color.utils";
import { ImagePreview } from "@/components/custom/image-preview";
import { CheckoutOrderSummary } from "../components/checkout-order-summary";
import { CheckoutUserForm } from "../components/checkout-user-form";
import { CheckoutAddressForm } from "../components/checkout-address-form";
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
    // 2: Informações pessoais
    // 3: Endereço de entrega
    // 4: Método de pagamento
    // 5: Confirmação
    return 5;
  };

  // Obter título da etapa atual
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Resumo do Pedido";
      case 2:
        return "Seus Dados";
      case 3:
        return "Endereço de Entrega";
      case 4:
        return "Forma de Pagamento";
      case 5:
        return "Pedido Finalizado";
      default:
        return "Checkout";
    }
  };

  // Verificar se o botão de próximo deve estar habilitado
  const isNextButtonEnabled = () => {
    switch (currentStep) {
      case 1:
        return true; // Sempre habilitado no resumo do pedido
      case 2:
        return checkoutVm.isPersonalInfoValid(); // Verificar se os dados pessoais estão preenchidos
      case 3:
        return checkoutVm.isAddressValid(); // Verificar se o endereço está preenchido
      case 4:
        return checkoutVm.isPaymentValid(); // Verificar se o método de pagamento foi selecionado
      default:
        return false;
    }
  };

  // Obter texto do botão de próximo
  const getNextButtonText = () => {
    switch (currentStep) {
      case 1:
        return "Continuar";
      case 2:
        return "Continuar para Endereço";
      case 3:
        return "Continuar para Pagamento";
      case 4:
        return "Finalizar Pedido";
      default:
        return "Continuar";
    }
  };

  // Verificar se devemos esconder o botão de voltar
  const shouldHideBackButton = () => {
    return currentStep === 5; // Na tela de confirmação, não há botão de voltar
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
        return <CheckoutAddressForm />;
      case 4:
        return <CheckoutPaymentMethod />;
      case 5:
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
            currentStep < 5
              ? `Etapa ${currentStep} de ${getTotalSteps() - 1}`
              : undefined
          }
          showBackButton={!shouldHideBackButton()}
          onBackPress={handlePreviousStep}
        />

        {/* Indicadores de etapas */}
        {currentStep < 5 && renderStepIndicators()}

        {/* Conteúdo principal */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: currentStep < 5 ? 120 : 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Barra de navegação inferior - omitir na etapa de conclusão */}
        {currentStep < 5 && (
          <View
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <Button
              onPress={currentStep === 4 ? handleFinishOrder : handleNextStep}
              style={{ backgroundColor: primaryColor }}
              isDisabled={!isNextButtonEnabled() || isProcessing}
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
