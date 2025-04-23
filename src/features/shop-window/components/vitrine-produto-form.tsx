// Path: src/features/shop-window/components/vitrine-produto-form.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Modal,
  FormControl,
  Button,
  VStack,
  Switch,
  HStack,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Package, ChevronRight } from "lucide-react-native";

import { useProducts } from "../../products/hooks/use-products";
import { VitrineProduto } from "../models";
import { THEME_COLORS } from "@/src/styles/colors";
import { ProductSelectorModal } from "./product-selector-modal";
import { ResilientImage } from "@/components/common/resilient-image";
import { ProductVariationSelector } from "./product-variation-selector";

const formSchema = z.object({
  produto: z
    .string({
      required_error: "Produto é obrigatório",
    })
    .min(1, "Produto é obrigatório"),
  produto_variado: z.string().nullable().optional(),
  ordem: z.string().optional(),
  sort: z.number().optional(),
  disponivel: z.boolean().default(true),
});

export type VitrineProdutoFormData = z.infer<typeof formSchema>;

interface VitrineProdutoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VitrineProdutoFormData) => void;
  isLoading: boolean;
  produto?: VitrineProduto;
}

export function VitrineProdutoForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  produto,
}: VitrineProdutoFormProps) {
  const { products } = useProducts();
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [hasVariation, setHasVariation] = useState(false);

  const form = useForm<VitrineProdutoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: "",
      produto_variado: null,
      ordem: "",
      sort: 0,
      disponivel: true,
    },
  });

  useEffect(() => {
    if (produto) {
      form.reset({
        produto: produto.produto.id,
        produto_variado: produto.produto_variado?.id || null,
        ordem: produto.ordem || "",
        sort: produto.sort || 0,
        disponivel: produto.disponivel ?? true,
      });

      // Encontrar o produto selecionado
      const productDetails = products.find((p) => p.id === produto.produto.id);
      if (productDetails) {
        setSelectedProduct(productDetails);
        setHasVariation(!!productDetails.variacao);
      }
    } else {
      form.reset({
        produto: "",
        produto_variado: null,
        ordem: "",
        sort: 0,
        disponivel: true,
      });
      setSelectedProduct(null);
      setHasVariation(false);
    }
  }, [produto, form, products]);

  const handleProductSelect = (productId: string) => {
    form.setValue("produto", productId);
    // Resetar o produto variado quando mudar o produto principal
    form.setValue("produto_variado", null);

    // Atualizar o produto selecionado para exibição
    const productDetails = products.find((p) => p.id === productId);
    setSelectedProduct(productDetails);

    // Verificar se o produto tem variação
    const productHasVariation = !!productDetails?.variacao;
    setHasVariation(productHasVariation);

    setIsProductSelectorOpen(false);
  };

  const handleVariationSelect = (variationId: string | null) => {
    form.setValue("produto_variado", variationId);
  };

  const formatCurrency = (value: string) => {
    try {
      const numericValue = parseFloat(value);
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (e) {
      return value;
    }
  };

  const handleSubmitForm = (data: VitrineProdutoFormData) => {
    // Validar se um produto com variação tem um produto variado selecionado
    if (hasVariation && !data.produto_variado) {
      form.setError("produto_variado", {
        type: "manual",
        message: "Selecione uma variação do produto",
      });
      return;
    }

    onSubmit(data);
  };

  return (
    <>
      <Modal isOpen={open} onClose={onClose}>
        <Modal.Content maxWidth={400} bg="$white" borderRadius="$lg">
          <Modal.CloseButton />
          <Modal.Header>
            <Text className="text-md font-bold text-gray-800">
              {produto
                ? "Editar Produto na Vitrine"
                : "Adicionar Produto à Vitrine"}
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space="md">
              <FormControl isInvalid={!!form.formState.errors.produto}>
                <FormControl.Label>
                  <Text className="text-gray-700 font-medium">Produto</Text>
                </FormControl.Label>

                <Controller
                  control={form.control}
                  name="produto"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      {/* Preview do produto selecionado */}
                      {selectedProduct ? (
                        <TouchableOpacity
                          onPress={() => setIsProductSelectorOpen(true)}
                          className="border rounded-lg p-3 flex-row items-center bg-white"
                          style={{ borderColor: error ? "#EF4444" : "#E5E7EB" }}
                        >
                          {/* Imagem do produto */}
                          <View className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                            {selectedProduct.imagem ? (
                              <ResilientImage
                                source={selectedProduct.imagem}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="w-full h-full items-center justify-center">
                                <Package size={24} color="#9CA3AF" />
                              </View>
                            )}
                          </View>

                          {/* Informações do produto */}
                          <View className="flex-1">
                            <Text className="font-medium" numberOfLines={2}>
                              {selectedProduct.nome}
                            </Text>

                            {/* Badge de variação */}
                            {hasVariation && (
                              <View className="mt-1 bg-blue-100 self-start px-2 py-0.5 rounded-full">
                                <Text className="text-xs text-blue-700">
                                  Produto com variações
                                </Text>
                              </View>
                            )}

                            {/* Preço - mostrar apenas se não tiver variação */}
                            {!hasVariation && (
                              <View className="flex-row items-center mt-1">
                                {selectedProduct.preco_promocional ? (
                                  <>
                                    <Text className="text-primary-600 font-bold text-sm">
                                      {formatCurrency(
                                        selectedProduct.preco_promocional
                                      )}
                                    </Text>
                                    <Text className="text-gray-500 line-through ml-2 text-xs">
                                      {formatCurrency(selectedProduct.preco)}
                                    </Text>
                                  </>
                                ) : (
                                  <Text className="text-gray-800 font-medium text-sm">
                                    {formatCurrency(selectedProduct.preco)}
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>

                          <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setIsProductSelectorOpen(true)}
                          className="border rounded-lg p-4 flex-row items-center justify-center bg-gray-50"
                          style={{ borderColor: error ? "#EF4444" : "#E5E7EB" }}
                        >
                          <Package size={20} color="#6B7280" />
                          <Text className="text-gray-700 ml-2">
                            Selecionar produto
                          </Text>
                          <ChevronRight
                            size={20}
                            color="#9CA3AF"
                            className="ml-2"
                          />
                        </TouchableOpacity>
                      )}

                      {error && (
                        <FormControl.Error>
                          <FormControl.Error.Text>
                            {error.message}
                          </FormControl.Error.Text>
                        </FormControl.Error>
                      )}
                    </>
                  )}
                />
              </FormControl>

              {/* Seletor de variação - apenas se o produto tiver variação */}
              {hasVariation && selectedProduct && (
                <Controller
                  control={form.control}
                  name="produto_variado"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <FormControl isInvalid={!!error}>
                      <ProductVariationSelector
                        productId={selectedProduct.id}
                        productName={selectedProduct.nome} // Passando o nome do produto
                        selectedVariationId={value ?? null}
                        onSelectVariation={handleVariationSelect}
                      />

                      {error && (
                        <FormControl.Error>
                          <FormControl.Error.Text>
                            {error.message}
                          </FormControl.Error.Text>
                        </FormControl.Error>
                      )}
                    </FormControl>
                  )}
                />
              )}

              {/* Disponibilidade do produto */}
              <Controller
                control={form.control}
                name="disponivel"
                render={({ field: { onChange, value } }) => (
                  <FormControl>
                    <HStack alignItems="center" justifyContent="space-between">
                      <FormControl.Label>
                        <Text className="text-gray-700 font-medium">
                          Disponível na vitrine
                        </Text>
                      </FormControl.Label>
                      <Switch
                        value={value}
                        onToggle={(val) => onChange(val)}
                        trackColor={{ false: "#D1D5DB", true: "#F4511E" }}
                        thumbColor={value ? "#FFFFFF" : "#FFFFFF"}
                      />
                    </HStack>
                  </FormControl>
                )}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <View className="flex-row justify-end gap-2 w-full">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
                flex={1}
                borderColor="$gray300"
              >
                <Button.Text color="$gray700">Cancelar</Button.Text>
              </Button>
              <Button
                onPress={form.handleSubmit(handleSubmitForm)}
                disabled={isLoading}
                flex={1}
                backgroundColor={THEME_COLORS.primary}
              >
                <Button.Text>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button.Text>
              </Button>
            </View>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Seletor de produtos */}
      <ProductSelectorModal
        visible={isProductSelectorOpen}
        onClose={() => setIsProductSelectorOpen(false)}
        onSelect={handleProductSelect}
        selectedProductId={form.getValues().produto}
      />
    </>
  );
}
