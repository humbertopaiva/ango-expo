// Path: src/features/products/screens/variation-edit-screen.tsx

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { Tag, Save, X, AlertCircle } from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import {
  VariationTypeForm,
  VariationTypeFormRef,
} from "../components/variation-type-form";
import { FormActions } from "@/components/custom/form-actions";
import { useVariationTypes } from "../hooks/use-variation-types";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { THEME_COLORS } from "@/src/styles/colors";

export function VariationEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { variations, updateVariation, isUpdating, isLoading, refetch } =
    useVariationTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<VariationTypeFormRef>(null);

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch, id]);

  // Find variation by ID
  const variation = variations.find((v) => v.id === id);

  const handleSubmit = async (data: { nome: string; variacao: string[] }) => {
    if (!id) {
      showErrorToast(toast, "ID da variação não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateVariation({
        id,
        data: {
          nome: data.nome,
          variacao: data.variacao,
        },
      });

      showSuccessToast(toast, "Tipo de variação atualizado com sucesso!");

      // Force refetch immediately
      await refetch();

      // Navigate back after brief delay
      setTimeout(() => {
        router.push("/admin/products/variations/types");
      }, 500);
    } catch (error) {
      console.error("Erro ao atualizar tipo de variação:", error);
      showErrorToast(toast, "Erro ao atualizar tipo de variação");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if fetching data
  if (isLoading || (!variation && !isLoading)) {
    return (
      <SafeAreaView style={styles.container}>
        <AdminScreenHeader
          title="Editar Variação"
          backTo="/admin/products/variations/types"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>
            Carregando dados da variação...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AdminScreenHeader
        title="Editar Variação"
        backTo="/admin/products/variations/types"
      />

      <ScrollView style={styles.scrollView}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <AlertCircle size={22} color="#1E40AF" />
            <Text style={styles.infoTitle}>Editando: {variation?.nome}</Text>
          </View>
          <Text style={styles.infoText}>
            Você está editando um tipo de variação existente. Altere o nome ou
            as opções de variação conforme necessário.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Tag size={20} color={THEME_COLORS.primary} />
            <Text style={styles.formTitle}>Dados da Variação</Text>
          </View>

          <VariationTypeForm
            ref={formRef}
            initialData={variation}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isUpdating}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isSubmitting || isUpdating}
        >
          <X size={20} color="#4B5563" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (isSubmitting || isUpdating) && styles.disabledButton,
          ]}
          onPress={() => formRef.current?.handleSubmit()}
          disabled={isSubmitting || isUpdating}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isSubmitting || isUpdating ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  formCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  cancelButtonText: {
    marginLeft: 8,
    color: "#4B5563",
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
