// Path: app/(drawer)/empresa/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { CompanyPageProvider } from "@/src/features/company-page/contexts/company-page-provider";
import { useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

/**
 * Layout compartilhado para todas as páginas dentro do caminho /(drawer)/empresa/
 * Aplica um header customizado e envolve as páginas com o provider para dados da empresa
 */
export default function CompanyLayout() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  return (
    <CompanyPageProvider companySlug={companySlug as string}>
      <Stack
        screenOptions={{
          // Configurações adicionais de estilo para todas as telas
          contentStyle: { backgroundColor: "#FFFFFF" },
          headerShown: true,
          headerBackTitle: "Voltar", // Texto para o botão de voltar (iOS)
          headerBackVisible: true, // Mostra o botão de voltar (Android/iOS)

          // Opcional: Customizar a cor do botão de voltar
          headerTintColor: "#F4511E", // Usar sua cor primária aqui

          // Opcional: Estilizar o header
          headerStyle: {
            backgroundColor: "white",
          },
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="[companySlug]/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[companySlug]/product/[productId]"
          options={{
            title: "Detalhes do Produto",
          }}
        />
        <Stack.Screen
          name="[companySlug]/cart"
          options={{
            title: "Carrinho",
          }}
        />
        <Stack.Screen
          name="[companySlug]/checkout"
          options={{
            title: "Finalizar Pedido",
          }}
        />
        <Stack.Screen
          name="[companySlug]/orders/index"
          options={{
            title: "Meus Pedidos",
          }}
        />
        <Stack.Screen
          name="[companySlug]/orders/[orderId]"
          options={{
            title: "Detalhes do Pedido",
          }}
        />
      </Stack>
    </CompanyPageProvider>
  );
}
