// Path: src/features/company-page/components/cart-fab.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { router } from "expo-router";

export function CartFAB() {
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();

  // Apenas mostrar se houver itens no carrinho e um companySlug
  if (cartVm.itemCount === 0 || !vm.profile?.empresa.slug) return null;

  const handlePress = () => {
    router.push(`/empresa/${vm.profile?.empresa.slug}/cart`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.fab, { backgroundColor: vm.primaryColor || "#F4511E" }]}
      className="shadow-xl"
    >
      <ShoppingBag size={22} color="white" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{cartVm.itemCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "white",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#F4511E",
    fontSize: 12,
    fontWeight: "bold",
  },
});
