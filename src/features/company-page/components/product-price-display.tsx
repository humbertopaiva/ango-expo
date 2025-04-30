// Path: src/features/company-page/components/product-price-display.tsx

import React from "react";
import { View, Text } from "react-native";
import { CompanyProduct } from "../models/company-product";

interface ProductPriceDisplayProps {
  product: CompanyProduct;
  primaryColor?: string;
  size?: "sm" | "md" | "lg";
  showParcelamento?: boolean;
  showAvista?: boolean;
}

export function ProductPriceDisplay({
  product,
  primaryColor = "#F4511E",
  size = "md",
  showParcelamento = true,
  showAvista = true,
}: ProductPriceDisplayProps) {
  // Verificar se o produto tem variação
  const hasVariation = product.tem_variacao === true;

  // Determinar se deve exibir o preço - modificado para nunca mostrar preço de produtos com variação
  const shouldShowPrice =
    !hasVariation && product.exibir_preco && product.preco;

  // Formatar preço
  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return "Preço não informado";

    try {
      const numericValue = parseFloat(value.replace(",", "."));
      if (isNaN(numericValue)) return "Preço não informado";

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Erro ao formatar valor monetário:", error);
      return "Preço não informado";
    }
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: {
      price: "text-sm",
      oldPrice: "text-xs",
      installment: "text-xs",
      avista: "text-xs",
    },
    md: {
      price: "text-base",
      oldPrice: "text-xs",
      installment: "text-xs",
      avista: "text-xs",
    },
    lg: {
      price: "text-2xl",
      oldPrice: "text-sm",
      installment: "text-sm",
      avista: "text-sm",
    },
  };

  // Para produtos com variação, mostrar as opções disponíveis em vez do preço
  if (!shouldShowPrice) {
    if (hasVariation) {
      return (
        <View className="bg-gray-50 rounded-lg py-2 px-3">
          <Text className="text-sm text-gray-700 font-medium">
            {product.variacao?.nome || "Produto com variações"}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            {product.variacao?.variacao?.length || 0} opções disponíveis
          </Text>
        </View>
      );
    } else if (!product.preco) {
      return (
        <View className="bg-gray-50 rounded-lg py-2 px-3">
          <Text className="text-sm text-gray-700 font-medium">
            Consultar preço
          </Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View>
      {product.preco_promocional ? (
        <View className="flex-row items-baseline gap-2">
          <Text
            className={`font-bold ${sizeClasses[size].price}`}
            style={{ color: primaryColor }}
          >
            {formatCurrency(product.preco_promocional)}
          </Text>
          <Text
            className={`text-gray-400 line-through ${sizeClasses[size].oldPrice}`}
          >
            {formatCurrency(product.preco)}
          </Text>
        </View>
      ) : (
        <Text
          className={`font-bold ${sizeClasses[size].price}`}
          style={{ color: primaryColor }}
        >
          {formatCurrency(product.preco)}
        </Text>
      )}

      {/* Parcelamento */}
      {showParcelamento &&
        product.parcelamento_cartao &&
        product.quantidade_parcelas && (
          <Text
            className={`text-gray-600 mt-1 ${sizeClasses[size].installment}`}
          >
            {product.parcelas_sem_juros ? (
              <>
                ou {product.quantidade_parcelas}x de{" "}
                {formatCurrency(
                  (
                    parseFloat(
                      (
                        product.preco_promocional ||
                        product.preco ||
                        "0"
                      ).replace(",", ".")
                    ) / parseInt(product.quantidade_parcelas)
                  ).toString()
                )}{" "}
                sem juros
              </>
            ) : (
              <>
                ou {product.quantidade_parcelas}x de{" "}
                {formatCurrency(
                  (
                    parseFloat(
                      (
                        product.preco_promocional ||
                        product.preco ||
                        "0"
                      ).replace(",", ".")
                    ) / parseInt(product.quantidade_parcelas)
                  ).toString()
                )}
              </>
            )}
          </Text>
        )}

      {/* Desconto à vista */}
      {showAvista && product.desconto_avista && (
        <Text
          className={`text-green-600 font-medium mt-1 ${sizeClasses[size].avista}`}
        >
          {formatCurrency(
            (
              parseFloat(
                (product.preco_promocional || product.preco || "0").replace(
                  ",",
                  "."
                )
              ) *
              (1 - product.desconto_avista / 100)
            ).toFixed(2)
          )}{" "}
          à vista ({product.desconto_avista}% de desconto)
        </Text>
      )}
    </View>
  );
}
