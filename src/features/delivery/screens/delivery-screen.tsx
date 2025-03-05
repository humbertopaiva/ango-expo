// src/features/delivery/screens/delivery-screen.tsx
import React from "react";
import { View, Text } from "react-native";
import { DeliveryPageProvider } from "../contexts/delivery-page-provider";
import { DeliveryScreenContent } from "./delivery-screen-content";
import { SafeAreaView } from "react-native-safe-area-context";

import { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): {
    hasError: boolean;
    error: Error;
  } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Delivery error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-lg font-bold text-red-500 mb-2">Oops!</Text>
            <Text className="text-center">
              Ocorreu um erro ao carregar a tela de delivery. Por favor, tente
              novamente mais tarde.
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export function DeliveryScreen() {
  return (
    <ErrorBoundary>
      <DeliveryPageProvider>
        <DeliveryScreenContent />
      </DeliveryPageProvider>
    </ErrorBoundary>
  );
}
