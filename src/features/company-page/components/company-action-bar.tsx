// Path: src/features/company-page/components/company-action-bar.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { ShoppingCart, Clock } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { HStack } from "@gluestack-ui/themed";

/**
 * Barra de ações fixa no rodapé da página da empresa
 * Contém botões para acessar o carrinho e pedidos relacionados à empresa
 */
export function CompanyActionBar() {
  const insets = useSafeAreaInsets();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();

  // Obtém o slug da empresa para navegação
  const companySlug = vm.profile?.empresa.slug || "";

  // Cores da empresa (usa valor padrão se não estiver definido)
  const primaryColor = vm.primaryColor || "#F4511E";

  // Quantidade de itens no carrinho
  const itemCount = cartVm.itemCount;

  // Navegação para a página de carrinho
  const handleCartPress = () => {
    router.push(`/(drawer)/empresa/${companySlug}/cart`);
  };

  // Navegação para a página de pedidos
  const handleOrdersPress = () => {
    router.push(`/(drawer)/empresa/${companySlug}/orders`);
  };

  // Calcula o padding bottom baseado na área segura (para dispositivos com notch)
  const safeBottomPadding = Platform.OS === "ios" ? insets.bottom : 0;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(safeBottomPadding, 8) },
        { borderTopColor: `${primaryColor}20` },
      ]}
    >
      <HStack space="md" className="px-4 py-2">
        {/* Botão de carrinho */}
        <TouchableOpacity
          onPress={handleCartPress}
          style={[styles.button, { backgroundColor: primaryColor }]}
          className="flex-1 rounded-xl"
        >
          <View style={styles.iconContainer}>
            <ShoppingCart size={20} color="white" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.buttonText}>Carrinho</Text>
        </TouchableOpacity>

        {/* Botão de pedidos */}
        <TouchableOpacity
          onPress={handleOrdersPress}
          style={[
            styles.button,
            {
              backgroundColor: "white",
              borderColor: primaryColor,
              borderWidth: 1,
            },
          ]}
          className="flex-1 rounded-xl"
        >
          <Clock size={20} color={primaryColor} />
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            Meus Pedidos
          </Text>
        </TouchableOpacity>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 768 : "100%",
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "white",
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F4511E",
  },
  badgeText: {
    color: "#F4511E",
    fontSize: 10,
    fontWeight: "bold",
  },
});
