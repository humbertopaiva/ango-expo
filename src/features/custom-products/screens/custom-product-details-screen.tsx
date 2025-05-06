// Path: src/features/custom-products/screens/custom-product-details-screen.tsx
// Corrigindo problema de scroll

import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useCustomProductById } from "../hooks/use-custom-products";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { THEME_COLORS } from "@/src/styles/colors";
import {
  Box,
  Edit,
  RefreshCw,
  AlertCircle,
  StepForwardIcon,
  Tag,
  Percent,
  Calendar,
  Info,
} from "lucide-react-native";
import { Card, useToast } from "@gluestack-ui/themed";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ImagePreview } from "@/components/custom/image-preview";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/common/toast-helper";
import { useProducts } from "@/src/features/products/hooks/use-products";
import { formatCurrency } from "@/src/utils/format.utils";

export function CustomProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { customProduct, isLoading, error, refetch } = useCustomProductById(
    id as string
  );
  const { products } = useProducts();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const toast = useToast();

  const handleEditCustomProduct = () => {
    router.push(`/admin/custom-products/${id}`);
  };

  // Para exibir o tipo de preço de forma amigável
  const getPriceTypeLabel = (priceType?: string) => {
    switch (priceType) {
      case "menor":
        return "Menor preço";
      case "maior":
        return "Maior preço";
      case "media":
        return "Média de preços";
      case "unico":
        return "Preço único";
      case "soma":
        return "Soma dos valores";
      default:
        return "Não definido";
    }
  };

  // Para atualizar os dados com pull-to-refresh
  const onRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      showSuccessToast(toast, "Dados atualizados com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      showErrorToast(toast, "Erro ao atualizar dados");
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, toast]);

  // Renderizar tela de carregamento
  if (isLoading || !customProduct) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes do Produto Personalizado"
          backTo="/admin/custom-products"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">
            Carregando detalhes do produto personalizado...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar tela de erro
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes do Produto Personalizado"
          backTo="/admin/custom-products"
        />
        <View className="flex-1 justify-center items-center p-4">
          <AlertCircle size={48} color="#EF4444" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">
            Erro ao carregar dados
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Ocorreu um erro ao carregar os detalhes deste produto personalizado.
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="mt-6 bg-primary-500 py-3 px-6 rounded-lg"
          >
            <Text className="text-white font-medium">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Encontrar produtos pelos IDs nos passos
  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Adicionando View com flex-1 para garantir que o ScrollView ocupe o espaço disponível */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100, // Aumento do padding inferior para dar espaço para o botão
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[THEME_COLORS.primary]}
              tintColor={THEME_COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={true} // Certifica que a barra de rolagem é visível
        >
          {/* Atualizar manualmente */}
          <TouchableOpacity
            onPress={onRefresh}
            className="flex-row items-center justify-center bg-blue-50 p-3 mb-4 rounded-xl"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              {isRefreshing ? "Atualizando..." : "Atualizar dados"}
            </Text>
          </TouchableOpacity>

          {/* Cabeçalho e Informações Gerais */}
          <Card className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4 gap-2">
              <Box size={20} color={THEME_COLORS.primary} className="mr-2" />
              <Text className="text-lg font-semibold text-gray-800">
                Informações Gerais
              </Text>
            </View>

            <View className="flex-row">
              {customProduct.imagem && (
                <View className="w-24 h-24 mr-4 rounded-lg overflow-hidden">
                  <ImagePreview
                    uri={customProduct.imagem}
                    containerClassName="rounded-lg"
                    fallbackIcon={Box}
                  />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">
                  {customProduct.nome}
                </Text>
                <Text className="text-gray-600 mt-1 mb-2">
                  {customProduct.descricao}
                </Text>

                <View>
                  <View
                    className={`self-start px-2 py-1 rounded-full ${
                      customProduct.status === "ativo"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={
                        customProduct.status === "ativo"
                          ? "text-xs text-green-800"
                          : "text-xs text-red-800"
                      }
                    >
                      {customProduct.status === "ativo"
                        ? "Ativo"
                        : "Desativado"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>

          {/* Estatísticas em Cards */}
          <View className="flex-row justify-between mb-4">
            <Card className="w-[48%] p-4 bg-white rounded-xl shadow-sm">
              <View className="items-center">
                <StepForwardIcon
                  size={22}
                  color={THEME_COLORS.primary}
                  className="mb-2"
                />
                <Text className="text-2xl font-bold text-gray-800">
                  {customProduct.passos?.length || 0}
                </Text>
                <Text className="text-gray-500 text-center">Passos</Text>
              </View>
            </Card>

            <Card className="w-[48%] p-4 bg-white rounded-xl shadow-sm">
              <View className="items-center">
                <Box size={22} color={THEME_COLORS.primary} className="mb-2" />
                <Text className="text-2xl font-bold text-gray-800">
                  {customProduct.passos?.reduce(
                    (total, passo) => total + passo.produtos.length,
                    0
                  ) || 0}
                </Text>
                <Text className="text-gray-500 text-center">Produtos</Text>
              </View>
            </Card>
          </View>

          {/* Informações de Preço */}
          <Card className="p-4 bg-white rounded-xl shadow-sm mb-4">
            <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4 gap-2">
              <Tag size={20} color={THEME_COLORS.primary} className="mr-2" />
              <Text className="text-lg font-semibold text-gray-800">
                Informações de Preço
              </Text>
            </View>

            <View className="py-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700 font-medium">
                  Tipo de Preço:
                </Text>
                <View className="bg-primary-50 px-3 py-1 rounded-full">
                  <Text className="text-primary-700 font-medium">
                    {getPriceTypeLabel(customProduct.preco_tipo)}
                  </Text>
                </View>
              </View>

              {customProduct.preco_tipo === "unico" && customProduct.preco && (
                <View className="mt-3 bg-gray-50 p-3 rounded-lg">
                  <Text className="text-gray-700 font-medium mb-1">
                    Preço fixado:
                  </Text>
                  <Text className="text-primary-700 font-semibold text-lg">
                    {formatCurrency(parseFloat(customProduct.preco))}
                  </Text>
                </View>
              )}

              <View className="mt-3 bg-gray-50 p-3 rounded-lg flex-row items-start gap-1">
                <Info size={18} color="#6B7280" className="mr-2 mt-0.5" />
                <Text className="text-gray-600 flex-1">
                  {customProduct.preco_tipo === "menor" &&
                    "O preço será calculado como o menor valor entre todos os produtos selecionados pelo cliente."}
                  {customProduct.preco_tipo === "media" &&
                    "O preço será calculado como a média dos valores de todos os produtos selecionados pelo cliente."}
                  {customProduct.preco_tipo === "maior" &&
                    "O preço será calculado como o maior valor entre todos os produtos selecionados pelo cliente."}
                  {customProduct.preco_tipo === "soma" &&
                    "O preço será calculado como a soma dos valores de todos os produtos selecionados pelo cliente."}
                  {customProduct.preco_tipo === "unico" &&
                    "Este produto tem um preço fixo, independente das escolhas do cliente."}
                </Text>
              </View>
            </View>
          </Card>

          {/* Passos de Personalização */}
          <Card className="p-4 bg-white rounded-xl shadow-sm mb-6">
            <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4 gap-2">
              <StepForwardIcon
                size={20}
                color={THEME_COLORS.primary}
                className="mr-2"
              />
              <Text className="text-lg font-semibold text-gray-800">
                Passos de Personalização
              </Text>
            </View>

            {customProduct.passos && customProduct.passos.length > 0 ? (
              <View className="gap-4">
                {customProduct.passos.map((passo, passoIndex) => (
                  <View
                    key={passoIndex}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    {/* Cabeçalho do passo */}
                    <View className="bg-gray-50 p-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="bg-primary-100 h-8 w-8 rounded-full items-center justify-center mr-2">
                          <Text className="text-primary-800 font-semibold">
                            {passo.passo_numero}
                          </Text>
                        </View>
                        <Text className="font-medium text-gray-800">
                          {passo.nome}
                        </Text>
                      </View>
                      <View className="bg-gray-200 px-2 py-1 rounded-full">
                        <Text className="text-xs text-gray-700">
                          {passo.qtd_items_step}{" "}
                          {passo.qtd_items_step === 1 ? "item" : "itens"}
                        </Text>
                      </View>
                    </View>

                    {/* Descrição do passo */}
                    {passo.descricao && (
                      <View className="p-3 border-b border-gray-100">
                        <Text className="text-gray-600">{passo.descricao}</Text>
                      </View>
                    )}

                    {/* Lista de produtos no passo */}
                    <View className="p-3">
                      <Text className="font-medium mb-2 text-gray-700">
                        Produtos disponíveis neste passo:
                      </Text>

                      <View className="gap-2">
                        {passo.produtos.map((produtoItem, produtoIndex) => {
                          const produtoDetalhes = getProductById(
                            produtoItem.produtos.key
                          );

                          if (!produtoDetalhes) {
                            return (
                              <View
                                key={produtoIndex}
                                className="p-3 bg-red-50 rounded-lg"
                              >
                                <Text className="text-red-500">
                                  Produto não encontrado (ID:{" "}
                                  {produtoItem.produtos.key})
                                </Text>
                              </View>
                            );
                          }

                          return (
                            <View
                              key={produtoIndex}
                              className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <View className="h-10 w-10 mr-3">
                                <ImagePreview
                                  uri={produtoDetalhes.imagem}
                                  fallbackIcon={Box}
                                  containerClassName="rounded-lg"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="font-medium text-gray-800">
                                  {produtoDetalhes.nome}
                                </Text>
                                {produtoDetalhes.preco && (
                                  <View className="flex-row items-center gap-1">
                                    <Tag
                                      size={12}
                                      color="#6B7280"
                                      className="mr-1"
                                    />
                                    <Text className="text-sm text-gray-600">
                                      {formatCurrency(
                                        parseFloat(produtoDetalhes.preco)
                                      )}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-6 items-center bg-gray-50 rounded-lg">
                <AlertCircle size={28} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 font-medium">
                  Nenhum passo configurado
                </Text>
                <Text className="text-gray-500 text-sm text-center mt-1 px-8">
                  Edite este produto para adicionar passos de personalização
                </Text>
              </View>
            )}
          </Card>

          {/* Espaço adicional para garantir que tudo seja visível mesmo com o botão fixo */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>

      {/* Botão de edição - agora posicionado na parte inferior */}
      <View className="absolute bottom-0 left-0 right-0">
        <PrimaryActionButton
          onPress={handleEditCustomProduct}
          label="Editar Produto"
          icon={<Edit size={20} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}
