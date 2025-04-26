// Path: src/features/custom-products/screens/custom-product-details-screen.tsx
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
import { SectionCard } from "@/components/custom/section-card";
import { THEME_COLORS } from "@/src/styles/colors";
import {
  MenuSquare,
  Box,
  Edit,
  Calendar,
  RefreshCw,
  AlertCircle,
  StepForwardIcon,
  Tag,
  Percent,
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

  // Formatar data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <AdminScreenHeader
        title={customProduct.nome}
        backTo="/admin/custom-products"
      />

      <ScrollView
        className="flex-1 p-4 pb-20"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[THEME_COLORS.primary]}
            tintColor={THEME_COLORS.primary}
          />
        }
      >
        {/* Atualizar manualmente */}
        <View className="bg-blue-50 p-3 mb-4 rounded-lg">
          <TouchableOpacity
            onPress={onRefresh}
            className="flex-row items-center justify-center"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              {isRefreshing ? "Atualizando..." : "Atualizar dados"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informações Gerais */}
        <SectionCard
          title="Informações Gerais"
          icon={<MenuSquare size={20} color="#374151" />}
        >
          <View className="py-4">
            <View className="flex-row items-start">
              {customProduct.imagem && (
                <View className="w-24 h-24 mr-4">
                  <ImagePreview
                    uri={customProduct.imagem}
                    containerClassName="rounded-lg"
                    fallbackIcon={Box}
                  />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-lg font-semibold">
                  {customProduct.nome}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {customProduct.descricao}
                </Text>

                <View className="mt-2">
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

            <View className="flex-row items-center mt-3">
              <Calendar size={16} color="#4B5563" className="mr-2" />
              <View>
                <Text className="text-sm text-gray-600">
                  Data de criação: {formatDate(customProduct.date_created)}
                </Text>
                {customProduct.date_updated && (
                  <Text className="text-sm text-gray-600">
                    Última atualização: {formatDate(customProduct.date_updated)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Informações de Preço */}
        <SectionCard
          title="Informações de Preço"
          icon={<Tag size={20} color="#374151" />}
        >
          <View className="py-4">
            <View className="flex-row items-center">
              <Percent
                size={18}
                color={THEME_COLORS.primary}
                className="mr-2"
              />
              <Text className="text-gray-700 font-medium">
                Tipo de Preço: {getPriceTypeLabel(customProduct.preco_tipo)}
              </Text>
            </View>

            {customProduct.preco_tipo === "unico" && customProduct.preco && (
              <View className="bg-primary-50 rounded-lg p-3 mt-2">
                <Text className="text-primary-700 font-semibold text-lg">
                  {formatCurrency(parseFloat(customProduct.preco))}
                </Text>
              </View>
            )}

            <View className="bg-gray-50 p-3 rounded-lg mt-3">
              <Text className="text-gray-600">
                {customProduct.preco_tipo === "menor" &&
                  "O preço será calculado como o menor valor entre todos os produtos selecionados pelo cliente."}
                {customProduct.preco_tipo === "media" &&
                  "O preço será calculado como a média dos valores de todos os produtos selecionados pelo cliente."}
                {customProduct.preco_tipo === "maior" &&
                  "O preço será calculado como o maior valor entre todos os produtos selecionados pelo cliente."}
                {customProduct.preco_tipo === "unico" &&
                  "Este produto tem um preço fixo, independente das escolhas do cliente."}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Estatísticas */}
        <View className="flex-row justify-between mb-4 mt-2">
          <Card className="w-[48%] p-4 bg-white">
            <View className="items-center">
              <StepForwardIcon
                size={20}
                color={THEME_COLORS.primary}
                className="mb-2"
              />
              <Text className="text-2xl font-bold">
                {customProduct.passos?.length || 0}
              </Text>
              <Text className="text-gray-500 text-center">Passos</Text>
            </View>
          </Card>

          <Card className="w-[48%] p-4 bg-white">
            <View className="items-center">
              <Box size={20} color={THEME_COLORS.primary} className="mb-2" />
              <Text className="text-2xl font-bold">
                {customProduct.passos?.reduce(
                  (total, passo) => total + passo.produtos.length,
                  0
                ) || 0}
              </Text>
              <Text className="text-gray-500 text-center">Produtos</Text>
            </View>
          </Card>
        </View>

        {/* Passos de Personalização */}
        <SectionCard
          title="Passos de Personalização"
          icon={<StepForwardIcon size={20} color="#374151" />}
        >
          {customProduct.passos && customProduct.passos.length > 0 ? (
            <View className="space-y-4 py-4">
              {customProduct.passos.map((passo, passoIndex) => (
                <Card key={passoIndex} className="p-4 bg-white">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-primary-100 px-3 py-1 rounded-full">
                      <Text className="text-primary-800 font-medium">
                        Passo {passo.passo_numero}
                      </Text>
                    </View>
                    <Text className="ml-3 text-gray-600">
                      Cliente seleciona {passo.qtd_items_step}{" "}
                      {passo.qtd_items_step === 1 ? "item" : "itens"}
                    </Text>
                  </View>

                  {/* Nome do passo */}
                  {passo.nome && (
                    <View className="mb-2 border-l-4 border-primary-200 pl-3">
                      <Text className="font-semibold text-gray-800">
                        {passo.nome}
                      </Text>
                    </View>
                  )}

                  {/* Descrição do passo */}
                  {passo.descricao && (
                    <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                      <Text className="text-gray-600">{passo.descricao}</Text>
                    </View>
                  )}

                  <Text className="font-medium mb-2 mt-2">
                    Produtos disponíveis:
                  </Text>

                  <View className="space-y-2">
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
                            <Text className="font-medium">
                              {produtoDetalhes.nome}
                            </Text>
                            {produtoDetalhes.preco && (
                              <Text className="text-xs text-gray-600">
                                {formatCurrency(
                                  parseFloat(produtoDetalhes.preco)
                                )}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View className="py-4 items-center">
              <AlertCircle size={24} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                Nenhum passo configurado
              </Text>
            </View>
          )}
        </SectionCard>
      </ScrollView>

      {/* Botão de edição */}
      <PrimaryActionButton
        onPress={handleEditCustomProduct}
        label="Editar Produto"
        icon={<Edit size={20} color="white" />}
      />
    </SafeAreaView>
  );
}
