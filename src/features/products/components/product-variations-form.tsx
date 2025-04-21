// Path: src/features/products/components/product-variations-form.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit, Trash, Image as ImageIcon } from "lucide-react-native";
import { CurrencyInput } from "@/components/common/currency-input";
import { StatusToggle } from "@/components/common/status-toggle";
import { ImageUpload } from "@/components/common/image-upload";

interface ProductVariation {
  id?: string;
  valor_variacao: string;
  preco: string;
  preco_promocional?: string | null;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
}

interface ProductVariationsFormProps {
  variations: ProductVariation[];
  variationValues: string[];
  onChange: (variations: ProductVariation[]) => void;
  isLoading?: boolean;
}

export function ProductVariationsForm({
  variations,
  variationValues,
  onChange,
  isLoading = false,
}: ProductVariationsFormProps) {
  const handleVariationChange = (
    index: number,
    field: keyof ProductVariation,
    value: any
  ) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value,
    };
    onChange(updatedVariations);
  };

  // Garantir que sempre temos um formulário para cada valor de variação
  React.useEffect(() => {
    if (variationValues.length > 0) {
      // Criar um mapa das variações existentes pelo valor
      const variationMap = new Map(
        variations.map((v) => [v.valor_variacao, v])
      );

      // Para cada valor de variação, garantir que temos um formulário
      const updatedVariations = variationValues.map((value) => {
        // Se já existe uma variação com este valor, usar ela
        if (variationMap.has(value)) {
          return variationMap.get(value)!;
        }

        // Senão, criar uma nova
        return {
          valor_variacao: value,
          preco: "",
          preco_promocional: "",
          imagem: null,
          status: "disponivel",
        } as ProductVariation;
      });

      onChange(updatedVariations);
    }
  }, [variationValues]);

  if (variationValues.length === 0) {
    return (
      <Card className="p-4 bg-gray-50">
        <Text className="text-center text-gray-500">
          Selecione um tipo de variação primeiro
        </Text>
      </Card>
    );
  }

  return (
    <ScrollView>
      {variations.map((variation, index) => (
        <Card key={variation.valor_variacao} className="mb-4 p-4 bg-white">
          <View className="mb-3 flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              {variation.valor_variacao}
            </Text>

            <View className="flex-row">
              <TouchableOpacity
                className="p-2 bg-gray-100 rounded-full mr-2"
                onPress={() => {
                  // Toggle status
                  handleVariationChange(
                    index,
                    "status",
                    variation.status === "disponivel"
                      ? "indisponivel"
                      : "disponivel"
                  );
                }}
              >
                <Text
                  className={`text-xs ${
                    variation.status === "disponivel"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {variation.status === "disponivel"
                    ? "Disponível"
                    : "Indisponível"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="space-y-4">
            {/* Imagem */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Imagem
              </Text>
              <ImageUpload
                value={variation.imagem || ""}
                onChange={(value) =>
                  handleVariationChange(index, "imagem", value)
                }
                disabled={isLoading}
              />
            </View>

            {/* Preço */}
            <CurrencyInput
              label="Preço"
              value={variation.preco}
              onChangeValue={(value) =>
                handleVariationChange(index, "preco", value)
              }
              isInvalid={!variation.preco}
              errorMessage={!variation.preco ? "Preço obrigatório" : undefined}
              disabled={isLoading}
              required
            />

            {/* Preço Promocional */}
            <CurrencyInput
              label="Preço Promocional"
              value={variation.preco_promocional || ""}
              onChangeValue={(value) =>
                handleVariationChange(index, "preco_promocional", value)
              }
              disabled={isLoading}
              placeholder="0,00"
            />

            {/* Status */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Disponibilidade
              </Text>
              <StatusToggle
                value={variation.status === "disponivel"}
                onChange={(value) =>
                  handleVariationChange(
                    index,
                    "status",
                    value ? "disponivel" : "indisponivel"
                  )
                }
                disabled={isLoading}
              />
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
