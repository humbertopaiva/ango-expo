// Path: src/features/products/screens/product-details-screen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { THEME_COLORS } from "@/src/styles/colors";
import {
  Package,
  DollarSign,
  Layers,
  Plus,
  Trash,
  Edit,
} from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { ImagePreview } from "@/components/custom/image-preview";
import { SectionCard } from "@/components/custom/section-card";
import { StatusBadge } from "@/components/custom/status-badge";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Card, useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import useAuthStore from "@/src/stores/auth";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { invalidateAllProductQueries } from "../utils/query-utils";

export function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deleteVariationId, setDeleteVariationId] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const toast = useToast();
  const { hasVariation } = useProducts();
  const queryClient = useQueryClient();

  // Efeito para forçar refetch quando a tela for montada ou o ID mudar
  useEffect(() => {
    if (id) {
      console.log(`Forçando refetch das queries para o produto ${id}`);
      // Invalidar e forçar refetch de todas as queries relevantes
      invalidateAllProductQueries(queryClient);

      // Forçar refetch específico para este produto
      queryClient.refetchQueries({ queryKey: ["product-details", id] });
      queryClient.refetchQueries({ queryKey: ["product-variation-items", id] });
    }
  }, [id, queryClient]);

  // Buscar detalhes do produto com tratamento melhorado
  const {
    data: product,
    isLoading,
    error,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => {
      try {
        // Obter o ID da empresa do usuário logado
        const companyId = useAuthStore.getState().getCompanyId();

        if (!id || !companyId) {
          throw new Error("ID do produto ou empresa não fornecido");
        }

        console.log(`Buscando detalhes do produto ${id}`);

        // Buscar todos os produtos da empresa
        const response = await api.get<{ data: Product[] }>(
          `/api/products?company=${companyId}`,
          { params: { _t: Date.now() } } // Adicionar cache buster
        );

        // Encontrar o produto específico pelo ID
        const productFound = response.data.data.find((p) => p.id === id);

        if (!productFound) {
          throw new Error("Produto não encontrado");
        }

        console.log("Produto encontrado:", productFound);
        return productFound;
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 0, // Sem cache em memória
  });

  // Buscar variações do produto
  const {
    variationItems,
    isLoading: isLoadingVariations,
    deleteVariationItem,
    isDeleting,
    refetch: refetchVariations,
  } = useProductVariationItems(id as string);

  // Efeito adicional para refetch periódico
  useEffect(() => {
    // Refetch a cada 5 segundos para garantir dados atualizados
    const intervalId = setInterval(() => {
      if (id) {
        console.log("Refetch periódico de dados");
        refetchProduct();
        refetchVariations();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id, refetchProduct, refetchVariations]);

  // Efeito para debug
  useEffect(() => {
    if (error) {
      console.error("Erro na consulta do produto:", error);
    }
    if (product) {
      console.log("Produto carregado com sucesso:", product);
    }
    console.log("Variações carregadas:", variationItems.length);
  }, [product, error, variationItems]);

  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return "";
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Error formatting currency value:", error);
      return "";
    }
  };

  const handleAddVariation = () => {
    if (!product || !hasVariation(product)) return;
    router.push(`/admin/products/${id}/add-variation`);
  };

  const confirmDeleteVariation = (variationId: string) => {
    setDeleteVariationId(variationId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVariation = async () => {
    if (!deleteVariationId) return;

    try {
      console.log(`Excluindo variação ${deleteVariationId}`);
      await deleteVariationItem(deleteVariationId);

      // Forçar refetch IMEDIATAMENTE após exclusão
      invalidateAllProductQueries(queryClient);

      // Forçar refetch específico
      queryClient.refetchQueries({ queryKey: ["product-details", id] });
      queryClient.refetchQueries({ queryKey: ["product-variation-items", id] });

      showSuccessToast(toast, "Variação excluída com sucesso");

      // Aguardar um momento antes de fechar o diálogo
      setTimeout(() => {
        setIsDeleteDialogOpen(false);
        setDeleteVariationId(null);

        // Refetch novamente (garantia dupla)
        refetchProduct();
        refetchVariations();
      }, 500);
    } catch (error) {
      console.error("Erro ao excluir variação:", error);
      showErrorToast(toast, "Erro ao excluir variação");
      setIsDeleteDialogOpen(false);
      setDeleteVariationId(null);
    }
  };

  // Função para obter o nome da variação
  const getVariationName = () => {
    if (!product || !product.variacao) return null;

    if (typeof product.variacao === "object" && product.variacao.nome) {
      return product.variacao.nome;
    }

    return "Variação configurada";
  };

  // Verificar se o produto tem variação
  const productHasVariation = product ? hasVariation(product) : false;

  // Forçar refetch manualmente das variações, útil para debugging
  const forceRefetchData = () => {
    console.log("Forçando refetch manual de dados");
    invalidateAllProductQueries(queryClient);
    refetchProduct();
    refetchVariations();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes do Produto"
          backTo="/admin/products/list"
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text className="mt-4 text-gray-500">
            Carregando detalhes do produto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Verificação adicional para garantir que o produto existe
  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes do Produto"
          backTo="/admin/products/list"
        />
        <View className="flex-1 justify-center items-center p-4">
          <Package size={48} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-medium text-gray-700">
            Produto não encontrado
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Não foi possível encontrar os detalhes deste produto. Verifique se o
            ID está correto.
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            ID consultado: {id || "não fornecido"}
          </Text>

          {/* Botão para forçar refetch */}
          <TouchableOpacity
            onPress={forceRefetchData}
            className="mt-6 bg-blue-500 rounded-lg py-3 px-6"
          >
            <Text className="text-white font-medium">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader title={product.nome} backTo="/admin/products/list" />

      <ScrollView className="flex-1 p-4 pb-20">
        {/* Imagem e informações básicas */}
        <SectionCard
          title="Informações Gerais"
          icon={<Package size={20} color="#374151" />}
        >
          <View className="flex-row mb-4">
            <View className="w-1/3 mr-4">
              <ImagePreview
                uri={product.imagem}
                height={120}
                containerClassName="rounded-lg"
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold">{product.nome}</Text>
              <View className="flex-row items-center mt-2">
                <StatusBadge
                  status={product.status}
                  customLabel={
                    product.status === "disponivel"
                      ? "Disponível"
                      : "Indisponível"
                  }
                />
                {productHasVariation && (
                  <View className="ml-2 px-3 py-1 rounded-full bg-blue-100">
                    <Text className="text-xs text-blue-800">Com variações</Text>
                  </View>
                )}
              </View>
              {product.categoria && (
                <Text className="text-sm text-gray-600 mt-2">
                  Categoria:{" "}
                  <Text className="font-medium">
                    {typeof product.categoria === "object"
                      ? product.categoria.nome
                      : "Categoria #" + product.categoria}
                  </Text>
                </Text>
              )}
              {productHasVariation && (
                <Text className="text-sm text-gray-600 mt-1">
                  Tipo de variação:{" "}
                  <Text className="font-medium text-blue-700">
                    {getVariationName()}
                  </Text>
                </Text>
              )}
            </View>
          </View>

          {/* Descrição */}
          {product.descricao && !productHasVariation && (
            <View className="mt-2">
              <Text className="font-medium text-sm text-gray-700 mb-1">
                Descrição:
              </Text>
              <Text className="text-gray-600">{product.descricao}</Text>
            </View>
          )}
        </SectionCard>

        {/* Preço e condições de pagamento */}
        {!productHasVariation && (
          <SectionCard
            title="Preços e Pagamento"
            icon={<DollarSign size={20} color="#374151" />}
          >
            <View className="space-y-2">
              {product.preco && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Preço:</Text>
                  <Text className="font-medium">
                    {formatCurrency(product.preco)}
                  </Text>
                </View>
              )}

              {product.preco_promocional && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Preço promocional:</Text>
                  <Text className="font-medium text-primary-600">
                    {formatCurrency(product.preco_promocional)}
                  </Text>
                </View>
              )}

              {product.desconto_avista > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Desconto à vista:</Text>
                  <Text className="font-medium">
                    {product.desconto_avista}%
                  </Text>
                </View>
              )}

              {product.parcelamento_cartao && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Parcelamento:</Text>
                  <Text className="font-medium">
                    {product.quantidade_parcelas}x{" "}
                    {product.parcelas_sem_juros ? "sem juros" : "com juros"}
                  </Text>
                </View>
              )}
            </View>
          </SectionCard>
        )}

        {/* Variações de produto */}
        {productHasVariation && (
          <SectionCard
            title="Variações do Produto"
            icon={<Layers size={20} color="#374151" />}
          >
            {isLoadingVariations ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color={THEME_COLORS.primary} />
                <Text className="mt-2 text-gray-500">
                  Carregando variações...
                </Text>
              </View>
            ) : variationItems.length === 0 ? (
              <View className="py-8 items-center">
                <Layers size={32} color="#9CA3AF" />
                <Text className="mt-2 text-gray-700 font-medium">
                  Nenhuma variação cadastrada
                </Text>
                <Text className="text-gray-500 text-center mt-1">
                  Adicione variações para este produto clicando no botão abaixo.
                </Text>

                {/* Botão para forçar refetch das variações */}
                <TouchableOpacity
                  onPress={forceRefetchData}
                  className="mt-4 bg-blue-100 rounded-lg py-2 px-4"
                >
                  <Text className="text-blue-700">Atualizar lista</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-3 mt-2">
                {variationItems.map((item) => (
                  <Card key={item.id} className="p-4 bg-white">
                    <View className="flex-row items-start">
                      {/* Imagem da variação, se disponível */}
                      {(item.imagem || product.imagem) && (
                        <View className="w-16 h-16 mr-3">
                          <ImagePreview
                            uri={item.imagem || product.imagem}
                            containerClassName="rounded-lg"
                          />
                        </View>
                      )}

                      <View className="flex-1">
                        <View className="flex-row justify-between">
                          <Text className="font-medium">
                            {item.variacao.nome}: {item.valor_variacao}
                          </Text>
                          <View className="flex-row">
                            <TouchableOpacity
                              onPress={() =>
                                router.push(
                                  `/admin/products/${product.id}/variation/${item.id}`
                                )
                              }
                              className="p-2 bg-blue-50 rounded-full mr-2"
                            >
                              <Edit size={18} color="#3B82F6" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => confirmDeleteVariation(item.id)}
                              className="p-2 bg-red-50 rounded-full"
                            >
                              <Trash size={18} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Status */}
                        <View className="mt-1">
                          <StatusBadge
                            status={
                              item.disponivel === false
                                ? "indisponivel"
                                : "disponivel"
                            }
                            customLabel={
                              item.disponivel === false
                                ? "Indisponível"
                                : "Disponível"
                            }
                          />
                        </View>

                        {/* Preço */}
                        {item.preco && (
                          <View className="mt-1 flex-row items-center">
                            {item.preco_promocional ? (
                              <>
                                <Text className="text-primary-600 font-medium">
                                  {formatCurrency(item.preco_promocional)}
                                </Text>
                                <Text className="ml-2 text-gray-500 line-through text-sm">
                                  {formatCurrency(item.preco)}
                                </Text>
                              </>
                            ) : (
                              <Text className="text-primary-600 font-medium">
                                {formatCurrency(item.preco)}
                              </Text>
                            )}
                          </View>
                        )}

                        {/* Descrição resumida */}
                        {item.descricao && (
                          <Text
                            className="text-gray-600 text-sm mt-1"
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.descricao}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card>
                ))}

                {/* Botão para forçar refetch das variações */}
                <TouchableOpacity
                  onPress={forceRefetchData}
                  className="self-center mt-2 bg-gray-100 rounded-lg py-2 px-4"
                >
                  <Text className="text-gray-700">Atualizar lista</Text>
                </TouchableOpacity>
              </View>
            )}
          </SectionCard>
        )}
      </ScrollView>

      {/* Botão de adicionar variação (apenas se o produto tiver variação) */}
      {productHasVariation && (
        <PrimaryActionButton
          onPress={handleAddVariation}
          label="Adicionar Variação"
          icon={<Plus size={20} color="white" />}
        />
      )}

      {/* Diálogo de confirmação para excluir variação */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteVariationId(null);
        }}
        onConfirm={handleDeleteVariation}
        title="Excluir Variação"
        message="Tem certeza que deseja excluir esta variação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}
