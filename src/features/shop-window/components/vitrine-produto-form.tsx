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

const formSchema = z.object({
  produto: z
    .string({
      required_error: "Produto é obrigatório",
    })
    .min(1, "Produto é obrigatório"),
  disponivel: z.boolean().default(true),
  ordem: z.string().optional(),
  sort: z.number().optional(),
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

  const form = useForm<VitrineProdutoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: "",
      disponivel: true,
      ordem: "",
      sort: 0,
    },
  });

  useEffect(() => {
    if (produto) {
      form.reset({
        produto: produto.produto.id,
        disponivel: produto.disponivel,
        ordem: produto.ordem || "",
        sort: produto.sort || 0,
      });

      // Encontrar o produto selecionado
      const productDetails = products.find((p) => p.id === produto.produto.id);
      if (productDetails) {
        setSelectedProduct(productDetails);
      }
    } else {
      form.reset({
        produto: "",
        disponivel: true,
        ordem: "",
        sort: 0,
      });
      setSelectedProduct(null);
    }
  }, [produto, form, products]);

  const handleProductSelect = (productId: string) => {
    form.setValue("produto", productId);
    // Atualizar o produto selecionado para exibição
    const productDetails = products.find((p) => p.id === productId);
    setSelectedProduct(productDetails);
    setIsProductSelectorOpen(false);
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

                            {/* Preço */}
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

              <Controller
                control={form.control}
                name="disponivel"
                render={({ field: { onChange, value } }) => (
                  <FormControl>
                    <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <FormControl.Label margin="$0">
                        <Text className="text-gray-700 font-medium">
                          {value
                            ? "Disponível na Vitrine"
                            : "Indisponível na Vitrine"}
                        </Text>
                      </FormControl.Label>
                      <Switch
                        value={value}
                        onValueChange={onChange}
                        trackColor={{
                          true: THEME_COLORS.primary,
                          false: "$gray300",
                        }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-1 ml-1">
                      {value
                        ? "O produto será exibido na vitrine para seus clientes"
                        : "O produto não será exibido na vitrine para seus clientes"}
                    </Text>
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
                onPress={form.handleSubmit(onSubmit)}
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
