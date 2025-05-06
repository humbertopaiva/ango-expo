// Path: src/features/addons/screens/addon-details-screen.tsx

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
import { useAddonsListById } from "../hooks/use-addons";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { THEME_COLORS } from "@/src/styles/colors";
import {
  Tag,
  Box,
  Edit,
  Calendar,
  RefreshCw,
  Info,
  AlertCircle,
  Clock,
} from "lucide-react-native";
import { useToast } from "@gluestack-ui/themed";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ImagePreview } from "@/components/custom/image-preview";
import { formatCurrency } from "@/src/utils/format.utils";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/common/toast-helper";

export function AddonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addonsList, isLoading, error, refetch } = useAddonsListById(
    id as string
  );
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const toast = useToast();

  const handleEditAddon = () => {
    router.push(`/admin/addons/${id}`);
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

  // Renderizar tela de erro
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AdminScreenHeader
          title="Detalhes da Lista de Adicionais"
          backTo="/admin/addons"
        />
        <View className="flex-1 justify-center items-center p-4">
          <AlertCircle size={48} color="#EF4444" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">
            Erro ao carregar dados
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Ocorreu um erro ao carregar os detalhes desta lista de adicionais.
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader title={addonsList.nome} backTo="/admin/addons" />

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
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
            <Box size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Informações Gerais
            </Text>
          </View>

          <Text className="text-xl font-semibold text-gray-800">
            {addonsList.nome}
          </Text>

          <View className="flex-row items-center mt-4">
            <Clock size={16} color="#6B7280" className="mr-2" />
            <View>
              <Text className="text-sm text-gray-600">
                Data de criação: {formatDate(addonsList.date_created)}
              </Text>
              {addonsList.date_updated && (
                <Text className="text-sm text-gray-600">
                  Última atualização: {formatDate(addonsList.date_updated)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Estatísticas em Cards */}
        <View className="flex-row justify-between mb-4">
          <View className="w-[48%] p-4 bg-white rounded-xl shadow-sm">
            <View className="items-center">
              <Box size={22} color={THEME_COLORS.primary} className="mb-2" />
              <Text className="text-2xl font-bold text-gray-800">
                {addonsList.produtos?.length || 0}
              </Text>
              <Text className="text-gray-500 text-center">Produtos</Text>
            </View>
          </View>

          <View className="w-[48%] p-4 bg-white rounded-xl shadow-sm">
            <View className="items-center">
              <Tag size={22} color={THEME_COLORS.primary} className="mb-2" />
              <Text className="text-2xl font-bold text-gray-800">
                {addonsList.categorias?.length || 0}
              </Text>
              <Text className="text-gray-500 text-center">Categorias</Text>
            </View>
          </View>
        </View>

        {/* Categorias associadas */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
            <Tag size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Categorias Associadas
            </Text>
          </View>

          {addonsList.categorias && addonsList.categorias.length > 0 ? (
            <View className="gap-2">
              {addonsList.categorias.map((category) => (
                <View
                  key={category.id}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex-row items-center"
                >
                  {category.categorias_produto_id.imagem && (
                    <View className="w-10 h-10 mr-3 rounded-lg overflow-hidden">
                      <ImagePreview
                        uri={category.categorias_produto_id.imagem}
                        containerClassName="rounded-lg"
                        fallbackIcon={Tag}
                      />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {category.categorias_produto_id.nome}
                    </Text>
                    <View className="mt-1">
                      <View
                        className={`px-2 py-0.5 rounded-full self-start ${
                          category.categorias_produto_id.categoria_ativa
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={
                            category.categorias_produto_id.categoria_ativa
                              ? "text-xs text-green-800"
                              : "text-xs text-red-800"
                          }
                        >
                          {category.categorias_produto_id.categoria_ativa
                            ? "Ativa"
                            : "Inativa"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Info size={28} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 font-medium">
                Nenhuma categoria associada
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Edite esta lista para adicionar categorias
              </Text>
            </View>
          )}
        </View>

        {/* Produtos associados */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
            <Box size={20} color={THEME_COLORS.primary} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Produtos Associados
            </Text>
          </View>

          {addonsList.produtos && addonsList.produtos.length > 0 ? (
            <View className="gap-2">
              {addonsList.produtos.map((product) => (
                <View
                  key={product.id}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex-row"
                >
                  {product.produtos_id.imagem && (
                    <View className="w-14 h-14 mr-3 rounded-lg overflow-hidden">
                      <ImagePreview
                        uri={product.produtos_id.imagem}
                        containerClassName="rounded-lg"
                        fallbackIcon={Box}
                      />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {product.produtos_id.nome}
                    </Text>

                    {product.produtos_id.preco && (
                      <View className="flex-row items-center mt-1">
                        {product.produtos_id.preco_promocional ? (
                          <>
                            <Text className="text-sm text-primary-600 font-semibold">
                              {formatCurrency(
                                parseFloat(
                                  product.produtos_id.preco_promocional
                                )
                              )}
                            </Text>
                            <Text className="ml-2 text-xs text-gray-500 line-through">
                              {formatCurrency(
                                parseFloat(product.produtos_id.preco)
                              )}
                            </Text>
                          </>
                        ) : (
                          <Text className="text-sm text-primary-600 font-semibold">
                            {formatCurrency(
                              parseFloat(product.produtos_id.preco)
                            )}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Status do produto */}
                    <View className="mt-2">
                      <View
                        className={`px-2 py-0.5 rounded-full self-start ${
                          product.produtos_id.status === "disponivel"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={
                            product.produtos_id.status === "disponivel"
                              ? "text-xs text-green-800"
                              : "text-xs text-red-800"
                          }
                        >
                          {product.produtos_id.status === "disponivel"
                            ? "Disponível"
                            : "Indisponível"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Info size={28} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 font-medium">
                Nenhum produto associado
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Edite esta lista para adicionar produtos
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão de edição */}
      <PrimaryActionButton
        onPress={handleEditAddon}
        label="Editar Lista"
        icon={<Edit size={20} color="white" />}
      />
    </SafeAreaView>
  );
}
