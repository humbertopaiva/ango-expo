// Path: src/features/addons/screens/addon-details-screen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useAddonsListById } from "../hooks/use-addons";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { SectionCard } from "@/components/custom/section-card";
import { THEME_COLORS } from "@/src/styles/colors";
import { Tag, Box, Edit, ListIcon, Layers } from "lucide-react-native";
import { Card, useToast } from "@gluestack-ui/themed";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ImagePreview } from "@/components/custom/image-preview";

export function AddonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addonsList, isLoading } = useAddonsListById(id as string);
  const toast = useToast();

  const handleEditAddon = () => {
    router.push(`/admin/addons/${id}`);
  };

  if (isLoading || !addonsList) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes da Lista de Adicionais"
          backTo="/admin/addons"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">
            Carregando detalhes da lista de adicionais...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader title={addonsList.nome} backTo="/admin/addons" />

      <ScrollView className="flex-1 p-4 pb-20">
        {/* Informações Gerais */}
        <SectionCard
          title="Informações Gerais"
          icon={<ListIcon size={20} color="#374151" />}
        >
          <View className="py-4">
            <Text className="text-lg font-semibold">{addonsList.nome}</Text>
            <Text className="text-sm text-gray-600 mt-2">
              Data de criação:{" "}
              {new Date(addonsList.date_created || "").toLocaleDateString()}
            </Text>
            <Text className="text-sm text-gray-600">
              Última atualização:{" "}
              {addonsList.date_updated
                ? new Date(addonsList.date_updated).toLocaleDateString()
                : "Nunca atualizado"}
            </Text>
          </View>
        </SectionCard>

        {/* Categorias associadas */}
        <SectionCard
          title="Categorias Associadas"
          icon={<Tag size={20} color="#374151" />}
        >
          {addonsList.categorias && addonsList.categorias.length > 0 ? (
            <View className="space-y-2 py-4">
              {addonsList.categorias.map((category) => (
                <Card key={category.id} className="p-3 bg-white">
                  <View className="flex-row items-center">
                    {category.categorias_produto_id.imagem && (
                      <View className="w-10 h-10 mr-3">
                        <ImagePreview
                          uri={category.categorias_produto_id.imagem}
                          containerClassName="rounded-lg"
                        />
                      </View>
                    )}
                    <View>
                      <Text className="font-medium">
                        {category.categorias_produto_id.nome}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {category.categorias_produto_id.categoria_ativa
                          ? "Ativa"
                          : "Inativa"}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View className="py-4">
              <Text className="text-gray-500">Nenhuma categoria associada</Text>
            </View>
          )}
        </SectionCard>

        {/* Produtos associados */}
        <SectionCard
          title="Produtos Associados"
          icon={<Box size={20} color="#374151" />}
        >
          {addonsList.produtos && addonsList.produtos.length > 0 ? (
            <View className="space-y-2 py-4">
              {addonsList.produtos.map((product) => (
                <Card key={product.id} className="p-3 bg-white">
                  <View className="flex-row items-center">
                    {product.produtos_id.imagem && (
                      <View className="w-12 h-12 mr-3">
                        <ImagePreview
                          uri={product.produtos_id.imagem}
                          containerClassName="rounded-lg"
                        />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="font-medium">
                        {product.produtos_id.nome}
                      </Text>

                      {product.produtos_id.preco && (
                        <View className="flex-row items-center mt-1">
                          {product.produtos_id.preco_promocional ? (
                            <>
                              <Text className="text-xs text-primary-500 font-medium">
                                {formatCurrency(
                                  product.produtos_id.preco_promocional
                                )}
                              </Text>
                              <Text className="ml-2 text-xs text-gray-500 line-through">
                                {formatCurrency(product.produtos_id.preco)}
                              </Text>
                            </>
                          ) : (
                            <Text className="text-xs text-primary-600 font-medium">
                              {formatCurrency(product.produtos_id.preco)}
                            </Text>
                          )}
                        </View>
                      )}

                      {product.produtos_id.tem_variacao && (
                        <View className="mt-1 flex-row items-center">
                          <Layers size={12} color="#3B82F6" />
                          <Text className="text-xs text-blue-600 ml-1">
                            Com variações
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View className="py-4">
              <Text className="text-gray-500">Nenhum produto associado</Text>
            </View>
          )}
        </SectionCard>
      </ScrollView>

      {/* Edit Button */}
      <PrimaryActionButton
        onPress={handleEditAddon}
        label="Editar Lista"
        icon={<Edit size={20} color="white" />}
      />
    </SafeAreaView>
  );
}

// Helper function to format currency values
function formatCurrency(value: string): string {
  if (!value) return "";
  try {
    const numericValue = parseFloat(value.replace(",", "."));
    if (isNaN(numericValue)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  } catch (error) {
    console.error("Error formatting currency value:", error);
    return "";
  }
}
