// Path: src/features/products/screens/edit-product-variation-screen.tsx

import React, { useState, useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  Textarea,
  TextareaInput,
  useToast,
} from "@gluestack-ui/themed";
import {
  Layers,
  AlertCircle,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  Eye,
} from "lucide-react-native";
import { CurrencyInput } from "@/components/common/currency-input";
import { ImageUpload } from "@/components/common/image-upload";
import { StatusToggle } from "@/components/common/status-toggle";
import { useProductVariationItems } from "../hooks/use-product-variations-items";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";
import { THEME_COLORS } from "@/src/styles/colors";
import { VariationVisibilityOptions } from "../components/variation-visibility-options";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";

// Schema for form validation
const productVariationFormSchema = z.object({
  variacao: z.string().min(1, "A variação é obrigatória"),
  valor_variacao: z.string().min(1, "O valor da variação é obrigatório"),
  preco: z.string().min(1, "O preço é obrigatório"),
  preco_promocional: z.string().nullable().optional(),
  descricao: z.string().nullable().optional(),
  imagem: z.string().nullable().optional(),
  disponivel: z.boolean().default(true),

  // New fields
  exibir_produto: z.boolean().default(true),
  exibir_preco: z.boolean().default(true),
  quantidade_maxima_carrinho: z.preprocess(
    (val) =>
      val === null || val === undefined || val === "" ? null : Number(val),
    z
      .number()
      .min(0, "Quantidade máxima não pode ser negativa")
      .nullable()
      .optional()
  ),
});

type ProductVariationFormData = z.infer<typeof productVariationFormSchema>;

export function EditProductVariationScreen() {
  const { productId, variationId } = useLocalSearchParams<{
    productId: string;
    variationId: string;
  }>();
  const toast = useToast();
  const {
    variationItems,
    updateVariationItem,
    isUpdating,
    isLoading: isLoadingVariations,
  } = useProductVariationItems(productId as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product-for-variation", productId],
    queryFn: async () => {
      const response = await api.get<{ data: any }>(
        `/api/products/${productId}`
      );
      return response.data.data;
    },
    enabled: !!productId,
  });

  // Find current variation
  const currentVariation = variationItems.find(
    (item) => item.id === variationId
  );

  // Form
  const form = useForm<ProductVariationFormData>({
    resolver: zodResolver(productVariationFormSchema),
    defaultValues: {
      preco: "",
      preco_promocional: "",
      descricao: "",
      imagem: "",
      disponivel: true,
    },
  });

  // Update form values when variation is loaded
  useEffect(() => {
    if (currentVariation) {
      form.reset({
        preco: currentVariation.preco || "",
        preco_promocional: currentVariation.preco_promocional || "",
        descricao: currentVariation.descricao || "",
        imagem: currentVariation.imagem || "",
        disponivel: currentVariation.disponivel !== false,

        // New fields - use default values if not defined
        quantidade_maxima_carrinho:
          currentVariation.quantidade_maxima_carrinho ?? null,
        exibir_produto: currentVariation.exibir_produto !== false, // default true
        exibir_preco: currentVariation.exibir_preco !== false, // default true
      });
    }
  }, [currentVariation, form]);

  const onSubmit = async (data: ProductVariationFormData) => {
    if (!variationId) {
      showErrorToast(toast, "ID da variação não encontrado");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateVariationItem({
        id: variationId,
        data: {
          preco: data.preco,
          preco_promocional: data.preco_promocional || undefined,
          descricao: data.descricao || undefined,
          imagem: data.imagem || undefined,
          disponivel: data.disponivel,
          quantidade_maxima_carrinho: data.quantidade_maxima_carrinho,
          exibir_produto: data.exibir_produto,
          exibir_preco: data.exibir_preco,
        },
      });

      showSuccessToast(toast, "Variação de produto atualizada com sucesso!");

      // Redirect to product details after a brief delay
      setTimeout(() => {
        router.push(`/admin/products/view/${productId}`);
      }, 500);
    } catch (error) {
      console.error("Erro ao atualizar variação:", error);
      showErrorToast(toast, "Erro ao atualizar variação de produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct || isLoadingVariations || !currentVariation) {
    return (
      <SafeAreaView style={styles.container}>
        <AdminScreenHeader
          title="Editar Variação"
          backTo={`/admin/products/view/${productId}`}
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
        backTo={`/admin/products/view/${productId}`}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Layers size={20} color="#1E40AF" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Editando variação: {currentVariation.variacao.nome} -{" "}
              {currentVariation.valor_variacao}
            </Text>
            <Text style={styles.infoText}>
              Edite as informações desta variação do produto {product?.nome}.
            </Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Layers size={18} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
          </View>

          <View style={styles.formDivider} />

          <View style={styles.sectionContent}>
            {/* Description */}
            <FormControl isInvalid={!!form.formState.errors.descricao}>
              <FormControlLabel>
                <Text style={styles.labelText}>Descrição</Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="descricao"
                render={({ field: { onChange, value } }) => (
                  <Textarea style={styles.textAreaContainer} h={150}>
                    <TextareaInput
                      placeholder="Digite a descrição da variação do produto"
                      onChangeText={onChange}
                      value={value || ""}
                      multiline={true}
                      textAlignVertical="top"
                      style={styles.textArea}
                    />
                  </Textarea>
                )}
              />
              {form.formState.errors.descricao && (
                <FormControlError>
                  <FormControlErrorText style={styles.errorText}>
                    {form.formState.errors.descricao.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <View style={styles.inputSpacing} />

            {/* Image */}
            <FormControl isInvalid={!!form.formState.errors.imagem}>
              <View style={styles.sectionSubheader}>
                <ImageIcon size={16} color={THEME_COLORS.primary} />
                <FormControlLabel>
                  <Text style={styles.labelText}>Imagem da Variação</Text>
                </FormControlLabel>
              </View>
              <Controller
                control={form.control}
                name="imagem"
                render={({ field: { onChange, value } }) => (
                  <ImageUpload
                    value={value || ""}
                    onChange={onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {form.formState.errors.imagem && (
                <FormControlError>
                  <FormControlErrorText style={styles.errorText}>
                    {form.formState.errors.imagem.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
              {product?.imagem && !form.watch("imagem") && (
                <View style={styles.tipContainer}>
                  <AlertCircle
                    size={16}
                    color="#92400E"
                    style={styles.tipIcon}
                  />
                  <Text style={styles.tipText}>
                    Se nenhuma imagem for fornecida, a imagem do produto
                    principal será utilizada.
                  </Text>
                </View>
              )}
            </FormControl>

            <View style={styles.inputSpacing} />

            {/* Status */}
            <FormControl>
              <FormControlLabel>
                <Text style={styles.labelText}>Disponibilidade</Text>
              </FormControlLabel>
              <Controller
                control={form.control}
                name="disponivel"
                render={({ field: { onChange, value } }) => (
                  <StatusToggle
                    value={value}
                    onChange={onChange}
                    activeLabel="Disponível para venda"
                    inactiveLabel="Indisponível"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>
          </View>
        </View>

        {/* Visibility Options */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Eye size={18} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Opções de Visibilidade</Text>
          </View>

          <View style={styles.formDivider} />

          <View style={styles.sectionContent}>
            <VariationVisibilityOptions
              control={form.control}
              isSubmitting={isSubmitting || isUpdating}
            />
          </View>
        </View>

        {/* Prices */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <DollarSign size={18} color={THEME_COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Preços</Text>
          </View>

          <View style={styles.formDivider} />

          <View style={styles.sectionContent}>
            {/* Price */}
            <Controller
              control={form.control}
              name="preco"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Preço"
                  value={value || ""}
                  onChangeValue={onChange}
                  isInvalid={!!form.formState.errors.preco}
                  errorMessage={form.formState.errors.preco?.message}
                  required
                />
              )}
            />

            <View style={styles.inputSpacing} />

            {/* Promotional Price */}
            <Controller
              control={form.control}
              name="preco_promocional"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  label="Preço Promocional"
                  value={value || ""}
                  onChangeValue={onChange}
                  isInvalid={!!form.formState.errors.preco_promocional}
                  errorMessage={
                    form.formState.errors.preco_promocional?.message
                  }
                  placeholder="0,00"
                />
              )}
            />
          </View>
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
          onPress={form.handleSubmit(onSubmit)}
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
    fontSize: 14,
    color: "#6B7280",
  },
  infoCard: {
    flexDirection: "row",
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1E40AF",
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  sectionCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  formDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  sectionContent: {
    padding: 16,
  },
  sectionSubheader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 8,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 150,
    minHeight: 150,
    padding: 12,
    fontSize: 14,
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
  },
  inputSpacing: {
    height: 20,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
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
