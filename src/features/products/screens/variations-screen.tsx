// Path: src/features/products/screens/variations-screen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useVariations } from "../hooks/use-variations";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalForm } from "@/components/custom/modal-form";
import { VariationForm, VariationFormRef } from "../components/variation-form";
import { ListItem } from "@/components/custom/list-item";
import { SearchInput } from "@/components/custom/search-input";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Card, useToast } from "@gluestack-ui/themed";
import { Plus, Tag, AlertTriangle } from "lucide-react-native";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ProductVariation } from "../models/variation";
import { router } from "expo-router";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import useAuthStore from "@/src/stores/auth";

export function VariationsScreen() {
  const toast = useToast();
  const {
    variations,
    isLoading,
    createVariation,
    updateVariation,
    deleteVariation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useVariations();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Referência para o formulário
  const variationFormRef = useRef<VariationFormRef>(null);

  // Verificar a estrutura dos dados recebidos
  useEffect(() => {
    if (variations && variations.length > 0) {
      console.log("Exemplo de variação recebida:", variations[0]);
    }
  }, [variations]);

  // Filtrar variações com base no termo de busca (com tratamento de erro)
  const filteredVariations = React.useMemo(() => {
    try {
      if (!Array.isArray(variations)) {
        console.log("variations não é um array:", variations);
        return [];
      }

      if (!searchTerm) {
        return variations;
      }

      return variations.filter(
        (v) =>
          v &&
          v.nome &&
          typeof v.nome === "string" &&
          v.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (err) {
      console.error("Error filtering variations:", err);
      return [];
    }
  }, [variations, searchTerm]);

  const handleCreateVariation = (data: {
    nome: string;
    variacao: string[];
  }) => {
    try {
      console.log("Criando variação com dados:", data);
      const companyId = useAuthStore((state) => state.getCompanyId());

      // Garantir que os dados estão no formato correto
      const payload = {
        nome: data.nome,
        variacao: Array.isArray(data.variacao) ? data.variacao : [],
        empresa: companyId,
      };

      createVariation(payload, {
        onSuccess: () => {
          showSuccessToast(toast, "Variação criada com sucesso!");
          setIsFormVisible(false);
        },
        onError: (error) => {
          console.error("Erro ao criar variação:", error);
          showErrorToast(
            toast,
            "Erro ao criar variação. Verifique o console para mais detalhes."
          );
        },
      });
    } catch (error) {
      console.error("Erro ao criar variação:", error);
      showErrorToast(toast, "Erro ao criar variação");
    }
  };

  const handleUpdateVariation = (data: {
    nome: string;
    variacao: string[];
  }) => {
    if (selectedVariation) {
      try {
        console.log("Atualizando variação com dados:", data);

        // Garantir que os dados estão no formato correto
        const payload = {
          nome: data.nome,
          variacao: Array.isArray(data.variacao) ? data.variacao : [],
        };

        updateVariation(
          { id: selectedVariation.id, data: payload },
          {
            onSuccess: () => {
              showSuccessToast(toast, "Variação atualizada com sucesso!");
              setIsFormVisible(false);
              setSelectedVariation(null);
            },
            onError: (error) => {
              console.error("Erro ao atualizar variação:", error);
              showErrorToast(
                toast,
                "Erro ao atualizar variação. Verifique o console para mais detalhes."
              );
            },
          }
        );
      } catch (error) {
        console.error("Erro ao atualizar variação:", error);
        showErrorToast(toast, "Erro ao atualizar variação");
      }
    }
  };

  const handleDeleteVariation = () => {
    if (variationToDelete) {
      deleteVariation(variationToDelete, {
        onSuccess: () => {
          showSuccessToast(toast, "Variação excluída com sucesso!");
          setIsDeleteDialogOpen(false);
          setVariationToDelete(null);
        },
        onError: (error) => {
          console.error("Erro ao excluir variação:", error);
          showErrorToast(
            toast,
            "Erro ao excluir variação. Verifique o console para mais detalhes."
          );
        },
      });
    }
  };

  const openCreateForm = () => {
    setSelectedVariation(null);
    setIsFormVisible(true);
  };

  const openEditForm = (variation: ProductVariation) => {
    console.log("Abrindo formulário para editar variação:", variation);
    setSelectedVariation(variation);
    setIsFormVisible(true);
  };

  const confirmDelete = (id: string) => {
    setVariationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">
        <Card className="p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                Variações
              </Text>
              <Text className="text-sm text-gray-600">
                Gerencie os tipos de variação para seus produtos
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary-500 px-4 py-2 rounded-lg"
              onPress={() => router.push("/admin/products/variations/types")}
            >
              <View className="flex-row items-center">
                <Tag size={16} color="white" className="mr-1" />
                <Text className="text-white font-medium">Gerenciar Tipos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Search */}
        <SearchInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar variações..."
          disabled={isLoading}
        />

        {/* Error message */}
        {error && (
          <View className="bg-red-50 p-4 rounded-lg mb-4 flex-row items-center">
            <AlertTriangle size={20} color="#EF4444" />
            <Text className="ml-2 text-red-600">{error}</Text>
          </View>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0891B2" />
            <Text className="mt-2 text-gray-500">Carregando variações...</Text>
          </View>
        )}

        {/* List */}
        {!isLoading && !error && (
          <ScrollView className="flex-1">
            {filteredVariations.map((variation) => (
              <View key={variation.id} className="mb-3">
                <ListItem
                  title={variation.nome || "Sem nome"}
                  subtitle={`${variation.variacao?.length || 0} opções`}
                  description={
                    Array.isArray(variation.variacao)
                      ? variation.variacao.join(", ")
                      : "Sem variações"
                  }
                  imageIcon={Tag}
                  onEdit={() => openEditForm(variation)}
                  onDelete={() => confirmDelete(variation.id)}
                />
              </View>
            ))}

            {filteredVariations.length === 0 && (
              <View className="bg-white rounded-lg p-6 items-center justify-center my-8">
                <Tag size={40} color="#9CA3AF" />
                <Text className="text-lg font-medium text-gray-500 mt-2">
                  {searchTerm
                    ? "Nenhuma variação encontrada"
                    : "Nenhuma variação cadastrada"}
                </Text>
                <Text className="text-center text-gray-400 mt-1">
                  {searchTerm
                    ? "Tente um termo diferente"
                    : "Adicione variações para seus produtos"}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Floating Button */}
        <PrimaryActionButton
          onPress={openCreateForm}
          label="Nova Variação"
          icon={<Plus size={20} color="white" />}
        />

        {/* Form Modal */}
        <ModalForm
          isOpen={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSubmit={() => {
            // Acionar a submissão do formulário via ref
            if (variationFormRef.current) {
              variationFormRef.current.handleSubmit();
            }
          }}
          title={selectedVariation ? "Editar Variação" : "Nova Variação"}
          submitLabel={isCreating || isUpdating ? "Salvando..." : "Salvar"}
          isLoading={isCreating || isUpdating}
          maxWidth={500}
        >
          <VariationForm
            ref={variationFormRef}
            initialData={selectedVariation || undefined}
            onSubmit={
              selectedVariation ? handleUpdateVariation : handleCreateVariation
            }
            onCancel={() => setIsFormVisible(false)}
            isSubmitting={isCreating || isUpdating}
          />
        </ModalForm>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteVariation}
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
