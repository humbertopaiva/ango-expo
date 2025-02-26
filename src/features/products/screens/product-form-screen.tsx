// Path: src/features/products/screens/product-form-screen.tsx
import React, { useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useProducts } from "../hooks/use-products";
import { ProductFormModal } from "../components/product-form-modal";
import { ProductFormData } from "../schemas/product.schema";
import ScreenHeader from "@/components/ui/screen-header";

interface ProductFormScreenProps {
  productId?: string;
}

export function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const params = useLocalSearchParams<{ id: string }>();
  const id = productId || params.id;
  const isEditing = !!id;
  const [isModalOpen, setIsModalOpen] = useState(true);

  const {
    products,
    createProduct,
    updateProduct,
    isLoading,
    isCreating,
    isUpdating,
  } = useProducts();

  const product = products.find((p) => p.id === id);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && id) {
        await updateProduct({
          id,
          data: {
            nome: data.nome,
            descricao: data.descricao,
            preco: data.preco,
            preco_promocional: data.preco_promocional,
            categoria: data.categoria === 0 ? undefined : data.categoria,
            imagem: data.imagem,
            parcelamento_cartao: data.parcelamento_cartao,
            parcelas_sem_juros: data.parcelas_sem_juros,
            desconto_avista: data.desconto_avista,
            status: data.status,
          },
        });
      } else {
        await createProduct({
          nome: data.nome,
          descricao: data.descricao,
          preco: data.preco,
          preco_promocional: data.preco_promocional,
          categoria: data.categoria,
          imagem: data.imagem,
          parcelamento_cartao: data.parcelamento_cartao,
          parcelas_sem_juros: data.parcelas_sem_juros,
          desconto_avista: data.desconto_avista,
          status: data.status,
          estoque: 0,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  if (isEditing && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader
          title={isEditing ? "Editar Produto" : "Novo Produto"}
          showBackButton={true}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScreenHeader
        title={isEditing ? "Editar Produto" : "Novo Produto"}
        showBackButton={true}
      />

      <ProductFormModal
        open={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
        product={product}
      />

      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-400">
          {isEditing ? "Editando produto..." : "Criando novo produto..."}
        </Text>
      </View>
    </SafeAreaView>
  );
}
