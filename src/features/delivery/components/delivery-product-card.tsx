// Path: src/features/delivery/components/delivery-product-card.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { DeliveryShowcaseItem } from "../models/delivery-showcase-item";
import { THEME_COLORS } from "@/src/styles/colors";

interface DeliveryProductCardProps {
  product: DeliveryShowcaseItem;
  onPress: () => void;
  isDarkBackground?: boolean;
}

export function DeliveryProductCard({
  product,
  onPress,
  isDarkBackground = false,
}: DeliveryProductCardProps) {
  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(",", "."));
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular desconto
  const calculateDiscount = (original: string, promotional: string) => {
    const originalValue = parseFloat(original.replace(",", "."));
    const promotionalValue = parseFloat(promotional.replace(",", "."));
    return Math.round(
      ((originalValue - promotionalValue) / originalValue) * 100
    );
  };

  const textColor = isDarkBackground ? "#ffffff" : "#1F2937";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <Card style={styles.card}>
        {/* Seção da imagem com proporção fixa - AUMENTADA */}
        <View style={styles.imageContainer}>
          {product.imagem ? (
            <ImagePreview
              uri={product.imagem}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View style={styles.fallbackImage}>
              <Package size={48} color="#6B7280" />
            </View>
          )}

          {product.preco_promocional && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {calculateDiscount(product.preco, product.preco_promocional)}%
                OFF
              </Text>
            </View>
          )}

          {!product.disponivel && (
            <View style={styles.unavailableOverlay}>
              <Text style={styles.unavailableText}>Indisponível</Text>
            </View>
          )}
        </View>

        {/* Seção do conteúdo */}
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            {/* Título com corte de texto */}
            <Text
              style={[styles.title, { color: textColor }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.nome}
            </Text>

            {/* Descrição com corte de texto */}
            {product.descricao && (
              <Text
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {product.descricao}
              </Text>
            )}
          </View>

          {/* Seção de preço */}
          <View style={styles.priceContainer}>
            {product.preco_promocional ? (
              <>
                <Text style={styles.promotionalPrice}>
                  {formatCurrency(product.preco_promocional)}
                </Text>
                <Text style={styles.originalPrice}>
                  {formatCurrency(product.preco)}
                </Text>
              </>
            ) : (
              <Text style={styles.price}>{formatCurrency(product.preco)}</Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280, // Aumentado de 240px
    marginRight: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    height: 420, // Aumentado de 360px
  },
  imageContainer: {
    height: 240, // Aumentado de 180px
    width: "100%",
    position: "relative",
  },
  fallbackImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18, // Aumentado de 16px
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
    flex: 1,
  },
  priceContainer: {
    marginTop: "auto",
  },
  price: {
    fontSize: 20, // Aumentado de 18px
    fontWeight: "700",
    color: THEME_COLORS.primary,
  },
  promotionalPrice: {
    fontSize: 20, // Aumentado de 18px
    fontWeight: "700",
    color: THEME_COLORS.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginTop: 4,
  },
});
