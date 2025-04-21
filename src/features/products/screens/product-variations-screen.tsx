// Path: src/features/products/screens/product-variations-screen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductVariations } from "../hooks/use-product-variations";
import { useProducts } from "../hooks/use-products";
import { Card, useToast } from "@gluestack-ui/themed";
import { CurrencyInput } from "@/components/common/currency-input";
import { StatusToggle } from "@/components/common/status-toggle";
import { ImageUpload } from "@/components/common/image-upload";
import { ListItem } from "@/components/custom/list-item";
import { Tag, Plus, Package, AlertTriangle } from "lucide-react-native";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ModalForm } from "@/components/custom/modal-form";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Controller, useForm } from "react-hook-form";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import useAuthStore from "@/src/stores/auth";
import { ProductVariationDTO } from "../models/product";
import { router } from "expo-router";

interface ProductVariationsScreenProps {
  productId: string;
}

interface VariationFormData {
  valor_variacao: string;
  preco: string;
  preco_promocional?: string;
  imagem?: string | null;
  status?: "disponivel" | "indisponivel";
}

export function ProductVariationsScreen({
  productId,
}: ProductVariationsScreenProps) {
  const toast = useToast();
  const companyId = useAuthStore((state) => state.getCompanyId());
  const { products, isLoading: isLoadingProducts } = useProducts();
  const {
    variations,
    isLoading,
    createVariation,
    updateVariation,
    deleteVariation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductVariations(productId);

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null
  );

  // Formulário para adicionar/editar variação
  const form = useForm<VariationFormData>({
    defaultValues: {
      valor_variacao: "",
      preco: "",
      preco_promocional: "",
      imagem: null,
      status: "disponivel",
    },
  });

  // Obter o produto atual
  const product = products.find((p) => p.id === productId);

  // Obter o objeto da variação (contendo os valores possíveis)
  const variationType =
    product?.variacao && typeof product.variacao === "object"
      ? product.variacao
      : null;

  // Se não temos o produto ou ele não tem variação, redirecionar
  React.useEffect(() => {
    if (productId && product && !product.tem_variacao) {
      router.back();
    }
  }, [productId, product]);

  // Obter os valores possíveis da variação
  const variationValues = variationType?.variacao || [];

  // Filtra os valores que já estão em uso
  const availableValues = variationValues.filter(
    (value) => !variations.some((v) => v.valor_variacao === value)
  );

  const handleAddVariation = () => {
    setSelectedVariation(null);
    form.reset({
      valor_variacao: availableValues[0] || "",
      preco: "",
      preco_promocional: "",
      imagem: null,
      status: "disponivel",
    });
    setIsFormModalVisible(true);
  };

  const handleEditVariation = (variation: any) => {
    setSelectedVariation(variation);
    form.reset({
      valor_variacao: variation.valor_variacao,
      preco: variation.produto?.preco || "",
      preco_promocional: variation.produto?.preco_promocional || "",
      imagem: variation.produto?.imagem || null,
      status: variation.produto?.status || "disponivel",
    });
    setIsFormModalVisible(true);
  };

  const handleDeleteVariation = (id: string) => {
    setVariationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteVariation = async () => {
    if (!variationToDelete) return;

    try {
      await deleteVariation(variationToDelete);
      showSuccessToast(toast, "Variação excluída com sucesso");
      setIsDeleteDialogOpen(false);
      setVariationToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir variação:", error);
      showErrorToast(toast, "Erro ao excluir variação");
    }
  };

  const onSubmit = async (data: VariationFormData) => {
    try {
      if (!product?.variacao || typeof product.variacao !== "object") {
        showErrorToast(toast, "Tipo de variação não disponível");
        return;
      }

      const variationData: ProductVariationDTO = {
        produto: productId,
        variacao: product.variacao.id,
        valor_variacao: data.valor_variacao,
        preco: data.preco,
        preco_promocional: data.preco_promocional || null,
        imagem: data.imagem || null,
        status: data.status || "disponivel",
        empresa: companyId!,
      };

      if (selectedVariation) {
        await updateVariation({
          id: selectedVariation.id,
          data: variationData,
        });
        showSuccessToast(toast, "Variação atualizada com sucesso");
      } else {
        await createVariation(variationData);
        showSuccessToast(toast, "Variação adicionada com sucesso");
      }

      setIsFormModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar variação:", error);
      showErrorToast(toast, "Erro ao salvar variação");
    }
  };

  if (isLoadingProducts || (isLoading && !variations.length)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
          <Text className="mt-2 text-gray-500">Carregando variações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-4">
          <AlertTriangle size={48} color="#F59E0B" />
          <Text className="mt-4 text-lg font-semibold text-gray-800 text-center">
            Produto não encontrado
          </Text>
          <TouchableOpacity
            className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!product.tem_variacao || !product.variacao) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-4">
          <AlertTriangle size={48} color="#F59E0B" />
          <Text className="mt-4 text-lg font-semibold text-gray-800 text-center">
            Este produto não possui variações configuradas
          </Text>
          <TouchableOpacity
            className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
            onPress={() => router.push(`/admin/products/${productId}`)}
          >
            <Text className="text-white font-medium">Editar Produto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const variationName =
    typeof product.variacao === "object" ? product.variacao.nome : "Variação";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Card className="p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            {product.nome}
          </Text>
          <View className="flex-row items-center mt-1">
            <Tag size={16} color="#0891B2" />
            <Text className="ml-2 text-gray-600">
              Tipo de variação: {variationName}
            </Text>
          </View>
          <Text className="mt-2 text-gray-500">
            Valores disponíveis: {variationValues.join(", ")}
          </Text>
        </Card>

        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Variações Cadastradas
        </Text>

        {variations.length === 0 ? (
          <Card className="p-6 items-center justify-center">
            <Tag size={40} color="#9CA3AF" />
            <Text className="text-lg font-medium text-gray-500 mt-2">
              Nenhuma variação cadastrada
            </Text>
            <Text className="text-center text-gray-400 mt-1">
              Adicione variações para o produto
            </Text>
          </Card>
        ) : (
          <ScrollView>
            {variations.map((variation) => (
              <View key={variation.id} className="mb-3">
                <ListItem
                  title={variation.valor_variacao}
                  subtitle={`Preço: ${
                    variation.produto?.preco
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(variation.produto.preco))
                      : "Não definido"
                  }`}
                  imageUri={variation.produto?.imagem}
                  imageIcon={Package}
                  status={variation.produto?.status}
                  statusLabel={
                    variation.produto?.status === "disponivel"
                      ? "Disponível"
                      : "Indisponível"
                  }
                  onEdit={() => handleEditVariation(variation)}
                  onDelete={() => handleDeleteVariation(variation.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}

        {availableValues.length > 0 && (
          <PrimaryActionButton
            onPress={handleAddVariation}
            label="Adicionar Variação"
            icon={<Plus size={20} color="white" />}
          />
        )}

        {/* Modal de formulário */}
        <ModalForm
          isOpen={isFormModalVisible}
          onClose={() => setIsFormModalVisible(false)}
          onSubmit={form.handleSubmit(onSubmit)}
          title={selectedVariation ? "Editar Variação" : "Nova Variação"}
          submitLabel={isCreating || isUpdating ? "Salvando..." : "Salvar"}
          isLoading={isCreating || isUpdating}
        >
          <View className="space-y-4">
            {!selectedVariation && (
              <Controller
                control={form.control}
                name="valor_variacao"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Valor da Variação
                    </Text>
                    <View className="p-3 border border-gray-300 rounded-md bg-gray-50">
                      <Text>
                        {value ||
                          availableValues[0] ||
                          "Sem valores disponíveis"}
                      </Text>
                    </View>
                  </View>
                )}
              />
            )}

            <Controller
              control={form.control}
              name="preco"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Preço"
                  value={value}
                  onChangeValue={onChange}
                  disabled={isCreating || isUpdating}
                  required
                />
              )}
            />

            <Controller
              control={form.control}
              name="preco_promocional"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Preço Promocional"
                  value={value || ""}
                  onChangeValue={onChange}
                  disabled={isCreating || isUpdating}
                  placeholder="0,00"
                />
              )}
            />

            <Controller
              control={form.control}
              name="imagem"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Imagem
                  </Text>
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isCreating || isUpdating}
                  />
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Disponibilidade
                  </Text>
                  <StatusToggle
                    value={value === "disponivel"}
                    onChange={(newValue) => {
                      onChange(newValue ? "disponivel" : "indisponivel");
                    }}
                    disabled={isCreating || isUpdating}
                  />
                </View>
              )}
            />
          </View>
        </ModalForm>

        {/* Diálogo de confirmação */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteVariation}
          title="Excluir Variação"
          message="Tem certeza que deseja excluir esta variação? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
