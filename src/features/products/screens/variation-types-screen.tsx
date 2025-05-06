// Path: src/features/products/screens/variation-types-screen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, useToast } from "@gluestack-ui/themed";
import { useVariationTypes } from "../hooks/use-variation-types";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import {
  Tag,
  Plus,
  AlertTriangle,
  Edit,
  Trash,
  RefreshCw,
} from "lucide-react-native";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

export function VariationTypesScreen() {
  const toast = useToast();
  const { variations, isLoading, deleteVariation, isDeleting, refetch } =
    useVariationTypes();
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null
  );

  // Force refetch when the screen is mounted
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Pull-to-refresh function for manual updates
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleAddVariation = () => {
    router.push("/admin/variations/new");
  };

  const handleEditVariation = (id: string) => {
    router.push(`/admin/variations/edit/${id}`);
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
    <SafeAreaView style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {variations.length} tipo{variations.length !== 1 ? "s" : ""} de
            variação
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <RefreshCw size={16} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.infoCardContent}>
          <Tag size={22} color={THEME_COLORS.primary} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Tipos de Variação</Text>
            <Text style={styles.infoDescription}>
              Crie e gerencie tipos de variação como tamanho, cor, material,
              etc. Estes poderão ser usados nos seus produtos.
            </Text>
          </View>
        </View>
      </Card>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>Carregando variações...</Text>
        </View>
      ) : variations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Tag size={40} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            Nenhum tipo de variação cadastrado
          </Text>
          <Text style={styles.emptyDescription}>
            Adicione tipos de variação para seus produtos
          </Text>
          <TouchableOpacity
            style={styles.addEmptyButton}
            onPress={handleAddVariation}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addEmptyButtonText}>Nova Variação</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[THEME_COLORS.primary]}
            />
          }
        >
          {variations.map((variation) => (
            <View key={variation.id} style={styles.variationCard}>
              <View style={styles.variationHeader}>
                <View style={styles.variationIconContainer}>
                  <Tag size={18} color={THEME_COLORS.primary} />
                </View>
                <View style={styles.variationTitleContainer}>
                  <Text style={styles.variationTitle}>
                    {variation.nome || "Sem nome"}
                  </Text>
                  <Text style={styles.variationSubtitle}>
                    {variation.variacao?.length || 0} opções
                  </Text>
                </View>
              </View>

              {Array.isArray(variation.variacao) &&
                variation.variacao.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {variation.variacao.map((value, index) => (
                      <View key={`${value}-${index}`} style={styles.tagItem}>
                        <Text style={styles.tagText}>{value}</Text>
                      </View>
                    ))}
                  </View>
                )}

              {/* Aqui estão os botões de ação redesenhados para serem mais discretos */}
              <View style={styles.variationActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditVariation(variation.id)}
                >
                  <Edit size={16} color={THEME_COLORS.secondary} />
                  <Text
                    style={styles.actionButtonText}
                    className="text-secondary-500"
                  >
                    Editar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteVariation(variation.id)}
                >
                  <Trash size={16} color="#ef4444" />
                  <Text
                    style={styles.actionButtonText}
                    className="text-red-500"
                  >
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add button - only show if we have variations already */}
      {variations.length > 0 && (
        <PrimaryActionButton
          onPress={handleAddVariation}
          label="Nova Variação"
          icon={<Plus size={20} color="white" />}
        />
      )}

      {/* Confirmation Dialog */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  infoCard: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardContent: {
    flexDirection: "row",
    padding: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  addEmptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  addEmptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  variationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  variationHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  variationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F3F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  variationTitleContainer: {
    flex: 1,
  },
  variationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  variationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 100,
  },
  tagText: {
    fontSize: 12,
    color: "#4B5563",
  },
  editButton: {
    backgroundColor: THEME_COLORS.primary,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  variationActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#F9FAFB", // Fundo mais claro e sutil
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "transparent", // Sem cor de fundo
  },
  actionButtonText: {
    fontWeight: "500",
    marginLeft: 8,
    fontSize: 13,
  },
});
