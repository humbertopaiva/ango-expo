// Path: src/features/products/screens/variation-types-screen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, useToast } from "@gluestack-ui/themed";
import { useVariationTypes } from "../hooks/use-variation-types";
import { ListItem } from "@/components/custom/list-item";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ModalForm } from "@/components/custom/modal-form";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import {
  VariationTypeForm,
  VariationTypeFormRef,
} from "../components/variation-type-form";
import { Tag, Plus, AlertTriangle } from "lucide-react-native";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import useAuthStore from "@/src/stores/auth";
import { ProductVariation } from "../models/variation";

export function VariationTypesScreen() {
  const toast = useToast();
  const companyId = useAuthStore((state) => state.getCompanyId());
  const {
    variations,
    isLoading,
    createVariation,
    updateVariation,
    deleteVariation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useVariationTypes();

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null
  );

  const formRef = useRef<VariationTypeFormRef>(null);

  const handleAddVariation = () => {
    setSelectedVariation(null);
    setIsFormModalVisible(true);
  };

  const handleEditVariation = (variation: ProductVariation) => {
    setSelectedVariation(variation);
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
      showSuccessToast(toast, "Tipo de variação excluído com sucesso");
      setIsDeleteDialogOpen(false);
      setVariationToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir tipo de variação:", error);
      showErrorToast(toast, "Erro ao excluir tipo de variação");
    }
  };

  const onSubmit = async (data: { nome: string; variacao: string[] }) => {
    try {
      if (!companyId) {
        showErrorToast(toast, "ID da empresa não encontrado");
        return;
      }

      if (selectedVariation) {
        // Atualizar variação existente
        await updateVariation({
          id: selectedVariation.id,
          data: {
            ...data,
            empresa: companyId,
          },
        });
        showSuccessToast(toast, "Tipo de variação atualizado com sucesso");
      } else {
        // Criar nova variação
        await createVariation({
          ...data,
          empresa: companyId,
        });
        showSuccessToast(toast, "Tipo de variação criado com sucesso");
      }

      setIsFormModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar tipo de variação:", error);
      showErrorToast(toast, "Erro ao salvar tipo de variação");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
          <Text className="mt-2 text-gray-500">
            Carregando tipos de variação...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Card className="p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Tipos de Variação
          </Text>
          <Text className="mt-1 text-gray-600">
            Crie tipos de variação para seus produtos, como tamanho, cor, etc.
          </Text>
        </Card>

        {variations.length === 0 ? (
          <Card className="p-6 items-center justify-center">
            <Tag size={40} color="#9CA3AF" />
            <Text className="text-lg font-medium text-gray-500 mt-2">
              Nenhum tipo de variação cadastrado
            </Text>
            <Text className="text-center text-gray-400 mt-1">
              Adicione tipos de variação para seus produtos
            </Text>
          </Card>
        ) : (
          <ScrollView>
            {variations.map((variation) => (
              <View key={variation.id} className="mb-3">
                <ListItem
                  title={variation.nome || "Sem nome"}
                  subtitle={`${variation.variacao?.length || 0} opções`}
                  description={
                    Array.isArray(variation.variacao) &&
                    variation.variacao.length > 0
                      ? variation.variacao.join(", ")
                      : "Sem opções"
                  }
                  imageIcon={Tag}
                  onEdit={() => handleEditVariation(variation)}
                  onDelete={() => handleDeleteVariation(variation.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <PrimaryActionButton
          onPress={handleAddVariation}
          label="Novo Tipo de Variação"
          icon={<Plus size={20} color="white" />}
        />

        {/* Modal de formulário */}
        <ModalForm
          isOpen={isFormModalVisible}
          onClose={() => setIsFormModalVisible(false)}
          onSubmit={() => formRef.current?.handleSubmit()}
          title={
            selectedVariation
              ? "Editar Tipo de Variação"
              : "Novo Tipo de Variação"
          }
          submitLabel={isCreating || isUpdating ? "Salvando..." : "Salvar"}
          isLoading={isCreating || isUpdating}
        >
          <VariationTypeForm
            ref={formRef}
            initialData={selectedVariation || undefined}
            onSubmit={onSubmit}
            isSubmitting={isCreating || isUpdating}
          />
        </ModalForm>

        {/* Diálogo de confirmação */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteVariation}
          title="Excluir Tipo de Variação"
          message="Tem certeza que deseja excluir este tipo de variação? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          variant="danger"
          isLoading={isDeleting}
        />
      </View>
    </SafeAreaView>
  );
}
