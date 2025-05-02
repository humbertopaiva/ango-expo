// Path: app/(drawer)/empresa/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { CompanyPageProvider } from "@/src/features/company-page/contexts/company-page-provider";
import { useLocalSearchParams } from "expo-router";

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
          headerTintColor: "#FFFFFF",

          // Usar sua cor primária aqui

          // Opcional: Estilizar o header
          headerStyle: {
            backgroundColor: "#F4511E",
          },
          headerTitleStyle: {
            fontFamily: "JakartaSans_700Bold",
            fontSize: 18,
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
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/custom-product/[productId]"
          options={{
            title: "Personalize seu Produto",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/product-variation/[productId]"
          options={{
            title: "Detalhes do Produto",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/cart"
          options={{
            title: "Carrinho",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/checkout"
          options={{
            title: "Finalizar Pedido",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/orders/index"
          options={{
            title: "Meus Pedidos",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/orders/[orderId]"
          options={{
            title: "Detalhes do Pedido",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[companySlug]/profile"
          options={{
            title: "Meu Perfil",
            headerShown: true,
          }}
        />
      </Stack>
    </CompanyPageProvider>
  );
}
