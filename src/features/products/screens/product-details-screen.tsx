// Path: src/features/products/screens/product-details-screen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
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
  RefreshCw,
  Eye,
  AlertTriangle,
} from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { ImagePreview } from "@/components/custom/image-preview";
import { StatusBadge } from "@/components/custom/status-badge";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { useToast } from "@gluestack-ui/themed";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { Product } from "../models/product";
import { useProducts } from "../hooks/use-products";
import { invalidateProductQueries } from "../utils/query-utils";

export function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deleteVariationId, setDeleteVariationId] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
    useState(false);
  const toast = useToast();
  const {
    hasVariation,
    deleteProduct,
    isDeleting: isDeletingProduct,
  } = useProducts();
  const queryClient = useQueryClient();

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
        if (!id) {
          throw new Error("ID do produto não fornecido");
        }

        const response = await api.get<{ data: Product }>(
          `/api/products/${id}`,
          { params: { _t: Date.now() } }
        );

        if (!response.data.data) {
          throw new Error("Produto não encontrado");
        }

        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
    refetchOnMount: true,
  });

  // Buscar variações do produto
  const {
    variationItems,
    isLoading: isLoadingVariations,
    deleteVariationItem,
    isDeleting,
    refetch: refetchVariations,
  } = useProductVariationItems(id as string);

  const refreshProductData = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product-details", id] }),
        queryClient.invalidateQueries({
          queryKey: ["product-variation-items", id],
        }),
      ]);

      await Promise.all([refetchProduct(), refetchVariations()]);
      showSuccessToast(toast, "Dados atualizados com sucesso");
    } catch (error) {
      showErrorToast(toast, "Erro ao atualizar dados");
    }
  }, [id, refetchProduct, refetchVariations, queryClient, toast]);

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
      return "";
    }
  };

  const handleEditProduct = () => {
    if (!product) return;
    router.push(`/admin/products/${product.id}`);
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
      await deleteVariationItem(deleteVariationId);
      await invalidateProductQueries(queryClient, id as string, {
        invalidateList: true,
        invalidateDetails: true,
        invalidateVariations: true,
        refetch: true,
      });

      showSuccessToast(toast, "Variação excluída com sucesso");
    } catch (error) {
      showErrorToast(toast, "Erro ao excluir variação");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteVariationId(null);
    }
  };

  const confirmDeleteProduct = () => {
    setIsDeleteProductDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!id) return;

    try {
      await deleteProduct(id);
      showSuccessToast(toast, "Produto excluído com sucesso");
      router.replace("/admin/products/list");
    } catch (error) {
      showErrorToast(toast, "Erro ao excluir produto");
    } finally {
      setIsDeleteProductDialogOpen(false);
    }
  };

  // Verificar se o produto tem variação
  const productHasVariation = product ? hasVariation(product) : false;

  // Função para obter o nome da variação
  const getVariationName = () => {
    if (!product || !product.variacao) return null;

    if (typeof product.variacao === "object" && product.variacao.nome) {
      return product.variacao.nome;
    }

    return "Variação configurada";
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AdminScreenHeader
          title="Detalhes do Produto"
          backTo="/admin/products/list"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>
            Carregando detalhes do produto...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <AdminScreenHeader
          title="Detalhes do Produto"
          backTo="/admin/products/list"
        />
        <View style={styles.errorContainer}>
          <Package size={48} color="#9CA3AF" />
          <Text style={styles.errorTitle}>Produto não encontrado</Text>
          <Text style={styles.errorMessage}>
            Não foi possível encontrar os detalhes deste produto.
          </Text>

          <TouchableOpacity
            onPress={refreshProductData}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AdminScreenHeader
        title="Detalhes do Produto"
        backTo="/admin/products/list"
      />

      <ScrollView style={styles.scrollView}>
        {/* Main actions */}
        <View style={styles.mainActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProduct}
          >
            <Edit size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          {productHasVariation && (
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleAddVariation}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Adicionar Variação</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={confirmDeleteProduct}
          >
            <Trash size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.refreshContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshProductData}
          >
            <RefreshCw size={16} color="#6B7280" />
            <Text style={styles.refreshText}>Atualizar dados</Text>
          </TouchableOpacity>
        </View>

        {/* Product basics with square image */}
        <View style={styles.productBasics}>
          <View style={styles.imageWrapper}>
            <ImagePreview
              uri={product.imagem}
              width={100}
              height={100}
              containerClassName="rounded-md"
            />
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.nome}</Text>

            <View style={styles.statusRow}>
              <StatusBadge
                status={product.status}
                customLabel={
                  product.status === "disponivel"
                    ? "Disponível"
                    : "Indisponível"
                }
              />

              {productHasVariation && (
                <View style={styles.variationBadge}>
                  <Text style={styles.variationBadgeText}>Com variações</Text>
                </View>
              )}
            </View>

            {product.categoria && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categoria:</Text>
                <Text style={styles.infoValue}>
                  {typeof product.categoria === "object"
                    ? product.categoria.nome
                    : typeof product.categoria === "number"
                    ? `Categoria #${product.categoria}`
                    : "Sem categoria"}
                </Text>
              </View>
            )}

            {productHasVariation && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de variação:</Text>
                <Text style={styles.infoValue}>{getVariationName()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description section */}
        {product.descricao && !productHasVariation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.descricao}</Text>
          </View>
        )}

        {/* Pricing section */}
        {!productHasVariation && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={THEME_COLORS.primary} />
              <Text style={styles.sectionTitle}>Preços e Pagamento</Text>
            </View>

            <View style={styles.pricingContainer}>
              {product.preco && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Preço:</Text>
                  <Text style={styles.pricingValue}>
                    {formatCurrency(product.preco)}
                  </Text>
                </View>
              )}

              {product.preco_promocional && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Preço promocional:</Text>
                  <Text style={styles.promotionalPrice}>
                    {formatCurrency(product.preco_promocional)}
                  </Text>
                </View>
              )}

              {product.desconto_avista > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Desconto à vista:</Text>
                  <Text style={styles.pricingValue}>
                    {product.desconto_avista}%
                  </Text>
                </View>
              )}

              {product.parcelamento_cartao && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Parcelamento:</Text>
                  <Text style={styles.pricingValue}>
                    {product.quantidade_parcelas}x{" "}
                    {product.parcelas_sem_juros ? "sem juros" : "com juros"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Visibility options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color={THEME_COLORS.primary} />
            <Text style={styles.sectionTitle}>Visibilidade</Text>
          </View>

          <View style={styles.visibilityContainer}>
            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>
                Visibilidade do produto:
              </Text>
              <Text style={styles.visibilityValue}>
                {product.exibir_produto !== false ? "Visível" : "Oculto"}
              </Text>
            </View>

            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>Visibilidade do preço:</Text>
              <Text style={styles.visibilityValue}>
                {product.exibir_preco !== false ? "Visível" : "Sob consulta"}
              </Text>
            </View>

            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>
                Qtd. máxima no carrinho:
              </Text>
              <Text style={styles.visibilityValue}>
                {product.quantidade_maxima_carrinho !== null &&
                product.quantidade_maxima_carrinho !== undefined
                  ? product.quantidade_maxima_carrinho
                  : "Sem limite"}
              </Text>
            </View>
          </View>
        </View>

        {/* Variations */}
        {productHasVariation && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Layers size={20} color={THEME_COLORS.primary} />
              <Text style={styles.sectionTitle}>Variações</Text>
            </View>

            {isLoadingVariations ? (
              <View style={styles.loadingVariations}>
                <ActivityIndicator size="small" color={THEME_COLORS.primary} />
                <Text style={styles.loadingVariationsText}>
                  Carregando variações...
                </Text>
              </View>
            ) : variationItems.length === 0 ? (
              <View style={styles.emptyVariations}>
                <AlertTriangle size={24} color="#F59E0B" />
                <Text style={styles.emptyVariationsTitle}>
                  Nenhuma variação cadastrada
                </Text>
                <Text style={styles.emptyVariationsText}>
                  Adicione variações usando o botão "Adicionar Variação"
                </Text>
              </View>
            ) : (
              <View style={styles.variationsList}>
                {variationItems.map((item) => (
                  <View key={item.id} style={styles.variationItem}>
                    <View style={styles.variationHeader}>
                      <View style={styles.variationImageContainer}>
                        <ImagePreview
                          uri={item.imagem || product.imagem}
                          width={60}
                          height={60}
                          containerClassName="rounded-md"
                        />
                      </View>

                      <View style={styles.variationDetails}>
                        <View style={styles.variationNameRow}>
                          <Text style={styles.variationName}>
                            {item.valor_variacao}
                          </Text>
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

                        {item.preco && (
                          <View style={styles.variationPriceContainer}>
                            {item.preco_promocional ? (
                              <>
                                <Text style={styles.promotionalPrice}>
                                  {formatCurrency(item.preco_promocional)}
                                </Text>
                                <Text style={styles.originalPrice}>
                                  {formatCurrency(item.preco)}
                                </Text>
                              </>
                            ) : (
                              <Text style={styles.regularPrice}>
                                {formatCurrency(item.preco)}
                              </Text>
                            )}
                          </View>
                        )}

                        {item.descricao && (
                          <Text
                            style={styles.variationDescription}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.descricao}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.variationActions}>
                      <TouchableOpacity
                        style={styles.variationActionButton}
                        onPress={() =>
                          router.push(
                            `/admin/products/${product.id}/variation/${item.id}`
                          )
                        }
                      >
                        <Edit size={16} color="#FFFFFF" />
                        <Text style={styles.variationActionText}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.variationActionButton,
                          styles.deleteVariationButton,
                        ]}
                        onPress={() => confirmDeleteVariation(item.id)}
                      >
                        <Trash size={16} color="#FFFFFF" />
                        <Text style={styles.variationActionText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Spacing at the bottom */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Confirmation Dialog for Variation */}
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

      {/* Confirmation Dialog for Product */}
      <ConfirmationDialog
        isOpen={isDeleteProductDialogOpen}
        onClose={() => setIsDeleteProductDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        isLoading={isDeletingProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  errorMessage: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  mainActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  secondaryButton: {
    backgroundColor: "#3B82F6",
  },
  dangerButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 13,
  },
  refreshContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: "#6B7280",
    marginLeft: 6,
    fontSize: 13,
  },
  productBasics: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    marginRight: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
    overflow: "hidden",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 8,
  },
  variationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: 100,
  },
  variationBadgeText: {
    fontSize: 12,
    color: "#1E40AF",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginRight: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  pricingContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pricingLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  promotionalPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.primary,
  },
  visibilityContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  visibilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  visibilityLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  visibilityValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  loadingVariations: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingVariationsText: {
    marginTop: 8,
    color: "#6B7280",
  },
  emptyVariations: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 12,
  },
  emptyVariationsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#92400E",
    marginTop: 8,
  },
  emptyVariationsText: {
    fontSize: 13,
    color: "#92400E",
    textAlign: "center",
    marginTop: 4,
  },
  variationsList: {
    gap: 16,
  },
  variationItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  variationHeader: {
    flexDirection: "row",
    padding: 12,
  },
  variationImageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  variationDetails: {
    flex: 1,
    justifyContent: "center",
  },
  variationNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  variationName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  variationPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  regularPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLORS.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
    textDecorationLine: "line-through",
  },
  variationDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  variationActions: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
  },
  variationActionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 8,
  },
  deleteVariationButton: {
    backgroundColor: "#EF4444",
  },
  variationActionText: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 6,
  },
});
