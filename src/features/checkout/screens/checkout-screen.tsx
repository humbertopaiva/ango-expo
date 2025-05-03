// Path: src/features/checkout/screens/checkout-screen.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutStepper } from "../components/checkout-stepper";
import { OrderSummaryStep } from "../components/order-summary-step";
import { PersonalInfoStep } from "../components/personal-info-step";
import { PaymentMethodStep } from "../components/payment-method-step";
import { OrderConfirmationStep } from "../components/order-confirmation-step";

export function CheckoutScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const { currentStep, initialize, goToStep } = useCheckoutViewModel();

  // Inicializar checkout com dados do carrinho
  useEffect(() => {
    initialize();
  }, []);

  // Renderizar o passo atual
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OrderSummaryStep />;
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <PaymentMethodStep />;
      case 3:
        return <OrderConfirmationStep />;
      default:
        return <OrderSummaryStep />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Resumo do Pedido";
      case 1:
        return "Seus Dados";
      case 2:
        return "Forma de Pagamento";
      case 3:
        return "Confirmação";
      default:
        return "Checkout";
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <CheckoutStepper
        currentStep={currentStep}
        onStepPress={goToStep}
        allowNavigation={true}
      />

      {renderStep()}
    </View>
  );
}
