// Path: src/features/products/screens/variation-types-screen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, useToast } from "@gluestack-ui/themed";
import { useVariationTypes } from "../hooks/use-variation-types";
import { ListItem } from "@/components/custom/list-item";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { Tag, Plus, AlertTriangle } from "lucide-react-native";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

export function VariationTypesScreen() {
  const toast = useToast();
  const { variations, isLoading, deleteVariation, isDeleting } =
    useVariationTypes();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null
  );

  const handleAddVariation = () => {
    router.push("/admin/products/variations/new");
  };

  const handleEditVariation = (id: string) => {
    router.push(`/admin/products/variations/edit/${id}`);
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader title="Tipos de Variação" backTo="/admin/products" />

      <View className="p-4">
        <Card className="p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Tipos de Variação
          </Text>
          <Text className="mt-1 text-gray-600">
            Crie e gerencie tipos de variação como tamanho, cor, material, etc.
            Estes poderão ser usados nos seus produtos.
          </Text>
        </Card>

        {isLoading ? (
          <View className="p-4 items-center">
            <ActivityIndicator size="large" color={THEME_COLORS.primary} />
            <Text className="mt-2 text-gray-500">Carregando variações...</Text>
          </View>
        ) : variations.length === 0 ? (
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
          <ScrollView className="mb-20">
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
                  onEdit={() => handleEditVariation(variation.id)}
                  onDelete={() => handleDeleteVariation(variation.id)}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <PrimaryActionButton
          onPress={handleAddVariation}
          label="Nova Variação"
          icon={<Plus size={20} color="white" />}
        />

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
