// Path: src/features/company-page/components/custom-product-item-card.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { CustomProductItem } from "../models/custom-product";
import { ImagePreview } from "@/components/custom/image-preview";

interface CustomProductItemCardProps {
  item: CustomProductItem;
  isSelected: boolean;
  onSelect: () => void;
  primaryColor: string;
  showPrice: boolean;
}

export function CustomProductItemCard({
  item,
  isSelected,
  onSelect,
  primaryColor,
  showPrice,
}: CustomProductItemCardProps) {
  const produto = item.produto_detalhes;

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.7}
      style={[
        styles.container,
        isSelected && {
          borderColor: primaryColor,
          backgroundColor: "#F9FAFB",
        },
      ]}
    >
      {/* Círculo de seleção */}
      <View
        style={[
          styles.checkContainer,
          {
            backgroundColor: isSelected ? primaryColor : "#ffffff",
            borderColor: isSelected ? primaryColor : "#E5E7EB",
          },
        ]}
      >
        {isSelected && <Check size={14} color="white" strokeWidth={3} />}
      </View>

      {/* Imagem do produto */}
      {produto.imagem && (
        <View style={styles.imageContainer}>
          <ImagePreview
            uri={produto.imagem}
            width="100%"
            height="100%"
            resizeMode="cover"
            containerClassName="bg-gray-100"
          />
        </View>
      )}

      {/* Informações do produto */}
      <View style={styles.infoContainer}>
        {/* Nome do produto - muda estilo quando selecionado */}
        <Text
          style={[
            styles.productName,
            isSelected && {
              color: primaryColor,
              fontWeight: "600",
            },
          ]}
        >
          {produto.nome}
        </Text>

        {/* Descrição */}
        {produto.descricao && (
          <Text style={styles.description} numberOfLines={1}>
            {produto.descricao}
          </Text>
        )}

        {/* Informação de preço */}
        {showPrice && (produto.preco || produto.preco_promocional) && (
          <Text style={[styles.price, { color: primaryColor }]}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              parseFloat(produto.preco_promocional || produto.preco || "0")
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#EAECF0",
    backgroundColor: "white",
    marginVertical: 5,
    position: "relative",
    overflow: "hidden",
  },
  selectedIndicator: {
    position: "absolute",
    left: 0,
    top: 4,
    bottom: 4,
    width: 4,
    borderRadius: 2,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 14,
    // Borda sutil para destaque
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 2,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 3,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
});
