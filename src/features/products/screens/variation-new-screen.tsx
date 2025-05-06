// Path: src/features/products/screens/variation-new-screen.tsx

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Tag, Save, X, HelpCircle } from "lucide-react-native";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import {
  VariationTypeForm,
  VariationTypeFormRef,
} from "../components/variation-type-form";
import useAuthStore from "@/src/stores/auth";
import { useVariationTypes } from "../hooks/use-variation-types";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { THEME_COLORS } from "@/src/styles/colors";

export function VariationNewScreen() {
  const toast = useToast();
  const companyId = useAuthStore((state) => state.getCompanyId());
  const { createVariation, isCreating, refetch } = useVariationTypes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<VariationTypeFormRef>(null);

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async (data: { nome: string; variacao: string[] }) => {
    if (!companyId) {
      showErrorToast(toast, "ID da empresa não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      // Simplifying the model: just name, company and variation values
      await createVariation({
        nome: data.nome,
        variacao: data.variacao,
        empresa: companyId,
      });

      showSuccessToast(toast, "Tipo de variação criado com sucesso!");

      // Force refetch immediately
      await refetch();

      // Navigate back after brief delay
      setTimeout(() => {
        router.push("/admin/variations");
      }, 500);
    } catch (error) {
      console.error("Erro ao criar tipo de variação:", error);
      showErrorToast(toast, "Erro ao criar tipo de variação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Help Card */}
        <View style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <HelpCircle size={22} color="#1E40AF" />
            <Text style={styles.helpTitle}>O que são variações?</Text>
          </View>
          <Text style={styles.helpText}>
            Variações são características dos produtos que podem ter diferentes
            opções, como tamanhos, cores ou materiais. Aqui você cria os tipos
            de variação que poderão ser associados a produtos posteriormente.
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
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isCreating}
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
          disabled={isSubmitting || isCreating}
        >
          <X size={20} color="#4B5563" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (isSubmitting || isCreating) && styles.disabledButton,
          ]}
          onPress={() => formRef.current?.handleSubmit()}
          disabled={isSubmitting || isCreating}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isSubmitting || isCreating ? "Salvando..." : "Criar Variação"}
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
  scrollView: {
    flex: 1,
  },
  helpCard: {
    margin: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginLeft: 8,
  },
  helpText: {
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
