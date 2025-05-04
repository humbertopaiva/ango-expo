// Path: src/features/checkout/screens/checkout-screen.tsx
import React, { useEffect } from "react";
import { View, SafeAreaView, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutStepper } from "../components/checkout-stepper";
import { OrderSummaryStep } from "../components/order-summary-step";
import { PersonalInfoStep } from "../components/personal-info-step";
import { PaymentMethodStep } from "../components/payment-method-step";
import { OrderConfirmationStep } from "../components/order-confirmation-step";
import { CheckoutNavButtons } from "../components/checkout-nav-buttons";

export function CheckoutScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const {
    currentStep,
    initialize,
    goToStep,
    validateCurrentStep,
    nextStep,
    prevStep,
    isProcessing,
    finalizeOrder,
  } = useCheckoutViewModel();

  // Inicializar checkout com dados do carrinho
  useEffect(() => {
    initialize();
  }, []);

  // Verificar se o passo atual é válido
  const isStepValid = validateCurrentStep();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={styles.container}>
        <CheckoutStepper
          currentStep={currentStep}
          onStepPress={goToStep}
          allowNavigation={true}
          stepsValidation={[
            true,
            currentStep > 1,
            currentStep > 2,
            currentStep > 3,
          ]}
        />

        {/* Conteúdo com scroll */}
        <View style={styles.scrollContainer}>{renderStep()}</View>

        {/* Botões fixos na parte inferior */}
        <CheckoutNavButtons
          currentStep={currentStep}
          isValid={isStepValid}
          onNext={nextStep}
          onPrev={prevStep}
          isLastStep={currentStep === 3}
          onFinish={finalizeOrder}
          isProcessing={isProcessing}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 80, // Espaço para os botões fixos
  },
});
