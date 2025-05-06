// Path: src/features/addons/components/category-product-selector.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonText,
  Heading,
  CloseIcon,
} from "@gluestack-ui/themed";
import {
  PlusCircle,
  Tag,
  Box,
  Search,
  Check,
  AlertCircle,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { useAddonFormData } from "../hooks/use-addon-form-data";
import { formatCurrency } from "@/src/utils/format.utils";

interface CategoryProductSelectorProps {
  initialCategories?: number[];
  initialProducts?: string[];
  onCategoriesChange: (categoryIds: number[]) => void;
  onProductsChange: (productIds: string[]) => void;
}

export function CategoryProductSelector({
  initialCategories = [],
  initialProducts = [],
  onCategoriesChange,
  onProductsChange,
}: CategoryProductSelectorProps) {
  // Estados para os modais
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const {
    categories,
    products,
    filteredCategories,
    filteredProducts,
    selectedCategoryIds,
    selectedProductIds,
    isCategoriesLoading,
    isProductsLoading,
    categorySearchTerm,
    productSearchTerm,
    setCategorySearchTerm,
    setProductSearchTerm,
    toggleCategorySelection,
    toggleProductSelection,
    getSelectedCategories,
    getSelectedProducts,
  } = useAddonFormData(initialCategories, initialProducts);

  // Efeito para notificar mudanças nas seleções
  React.useEffect(() => {
    onCategoriesChange(selectedCategoryIds);
  }, [selectedCategoryIds, onCategoriesChange]);

  React.useEffect(() => {
    onProductsChange(selectedProductIds);
  }, [selectedProductIds, onProductsChange]);

  const selectedCategories = getSelectedCategories();
  const selectedProducts = getSelectedProducts();

  return (
    <View className="gap-6">
      {/* Seção de Produtos */}
      <View className="bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
          <Box size={20} color={THEME_COLORS.primary} className="mr-2" />
          <Text className="text-lg font-semibold text-gray-800">
            Produtos Adicionais
          </Text>
        </View>

        <Text className="text-gray-600 mb-4">
          Selecione quais produtos farão parte desta lista de adicionais
        </Text>

        {/* Cards dos produtos selecionados */}
        {isProductsLoading ? (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color={THEME_COLORS.primary} />
            <Text className="text-gray-500 mt-2">Carregando produtos...</Text>
          </View>
        ) : selectedProducts.length === 0 ? (
          <View className="p-5 bg-gray-50 rounded-xl items-center mb-4">
            <Box size={28} color="#9CA3AF" />
            <Text className="text-gray-600 font-medium mt-2">
              Nenhum produto selecionado
            </Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">
              Adicione produtos clicando no botão abaixo
            </Text>
          </View>
        ) : (
          <View className="gap-2 mb-4">
            {selectedProducts.map((product) => (
              <View
                key={product.id}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex-row items-center"
              >
                <View className="h-10 w-10 mr-3 rounded-md overflow-hidden">
                  <ImagePreview
                    uri={product.imagem}
                    fallbackIcon={Box}
                    containerClassName="rounded-md"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    {product.nome}
                  </Text>
                  {product.preco && (
                    <Text className="text-xs text-gray-600">
                      {formatCurrency(parseFloat(product.preco))}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => toggleProductSelection(product.id)}
                  className="p-2 rounded-full"
                >
                  <CloseIcon size="sm" color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Status de erro */}
        {!isProductsLoading && products.length === 0 && (
          <View className="p-3 bg-yellow-50 rounded-lg mb-4 border border-yellow-200">
            <View className="flex-row items-center">
              <AlertCircle size={18} color="#D97706" className="mr-2" />
              <Text className="text-yellow-800">
                Nenhum produto encontrado. Cadastre produtos primeiro.
              </Text>
            </View>
          </View>
        )}

        {/* Botão para abrir o modal de seleção de produtos */}
        <Button
          onPress={() => setProductModalVisible(true)}
          isDisabled={isProductsLoading || products.length === 0}
          className={`px-4 py-2 ${
            selectedProducts.length > 0 ? "bg-gray-100" : "bg-primary-500"
          }`}
          variant={selectedProducts.length > 0 ? "outline" : "solid"}
        >
          <PlusCircle
            size={18}
            color={selectedProducts.length > 0 ? THEME_COLORS.primary : "white"}
            className="mr-2"
          />
          <ButtonText
            color={selectedProducts.length > 0 ? THEME_COLORS.primary : "white"}
          >
            {selectedProducts.length > 0
              ? "Gerenciar Produtos"
              : "Selecionar Produtos"}
          </ButtonText>
        </Button>
      </View>

      {/* Seção de Categorias */}
      <View className="bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row items-center border-b border-gray-100 pb-3 mb-4">
          <Tag size={20} color={THEME_COLORS.primary} className="mr-2" />
          <Text className="text-lg font-semibold text-gray-800">
            Categorias
          </Text>
        </View>

        <Text className="text-gray-600 mb-4">
          Selecione para quais categorias esta lista de adicionais estará
          disponível
        </Text>

        {/* Cards das categorias selecionadas */}
        {isCategoriesLoading ? (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color={THEME_COLORS.primary} />
            <Text className="text-gray-500 mt-2">Carregando categorias...</Text>
          </View>
        ) : selectedCategories.length === 0 ? (
          <View className="p-5 bg-gray-50 rounded-xl items-center mb-4">
            <Tag size={28} color="#9CA3AF" />
            <Text className="text-gray-600 font-medium mt-2">
              Nenhuma categoria selecionada
            </Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">
              Adicione categorias clicando no botão abaixo
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap mb-4 gap-2">
            {selectedCategories.map((category) => (
              <View
                key={category.id}
                className="bg-primary-50 rounded-full px-3 py-2 flex-row items-center"
              >
                <Text className="text-primary-800 font-medium mr-2">
                  {category.nome}
                </Text>
                // Path:
                src/features/addons/components/category-product-selector.tsx
                (continuação)
                <TouchableOpacity
                  onPress={() => toggleCategorySelection(Number(category.id))}
                  className="p-1"
                >
                  <CloseIcon size="xs" color={THEME_COLORS.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Status de erro */}
        {!isCategoriesLoading && categories.length === 0 && (
          <View className="p-3 bg-yellow-50 rounded-lg mb-4 border border-yellow-200">
            <View className="flex-row items-center">
              <AlertCircle size={18} color="#D97706" className="mr-2" />
              <Text className="text-yellow-800">
                Nenhuma categoria encontrada. Cadastre categorias primeiro.
              </Text>
            </View>
          </View>
        )}

        {/* Botão para abrir o modal de seleção de categorias */}
        <Button
          onPress={() => setCategoryModalVisible(true)}
          isDisabled={isCategoriesLoading || categories.length === 0}
          className={`px-4 py-2 ${
            selectedCategories.length > 0 ? "bg-gray-100" : "bg-primary-500"
          }`}
          variant={selectedCategories.length > 0 ? "outline" : "solid"}
        >
          <PlusCircle
            size={18}
            color={
              selectedCategories.length > 0 ? THEME_COLORS.primary : "white"
            }
            className="mr-2"
          />
          <ButtonText
            color={
              selectedCategories.length > 0 ? THEME_COLORS.primary : "white"
            }
          >
            {selectedCategories.length > 0
              ? "Gerenciar Categorias"
              : "Selecionar Categorias"}
          </ButtonText>
        </Button>
      </View>

      {/* Modal de Seleção de Produtos */}
      <Modal
        isOpen={productModalVisible}
        onClose={() => {
          setProductModalVisible(false);
          setProductSearchTerm("");
        }}
        size="full"
      >
        <ModalContent style={styles.modalContainer}>
          {/* Modal Header (Fixed) */}
          <View style={styles.modalHeader}>
            <View className="flex-row items-center justify-between w-full px-4 py-3">
              <Heading size="md">Selecionar Produtos</Heading>
              <TouchableOpacity
                onPress={() => {
                  setProductModalVisible(false);
                  setProductSearchTerm("");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Campo de busca (Fixed) */}
            <View className="mx-4 mb-3 bg-gray-100 rounded-lg flex-row items-center px-3 py-2">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Buscar produtos..."
                value={productSearchTerm}
                onChangeText={setProductSearchTerm}
              />
              {productSearchTerm ? (
                <TouchableOpacity
                  onPress={() => setProductSearchTerm("")}
                  className="p-1"
                >
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Modal Body (Scrollable) */}
          <View style={styles.modalBody}>
            {/* Loading State */}
            {isProductsLoading ? (
              <View className="p-8 items-center">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
                <Text className="text-gray-500 mt-4">
                  Carregando produtos...
                </Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View className="p-8 items-center">
                <Box size={40} color="#9CA3AF" />
                <Text className="text-gray-500 mt-4 font-medium">
                  Nenhum produto encontrado
                </Text>
                {productSearchTerm ? (
                  <Text className="text-gray-400 text-center mt-2">
                    Tente usar termos diferentes na sua busca
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-center mt-2">
                    Você precisa cadastrar produtos para associá-los à lista de
                    adicionais
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleProductSelection(item.id)}
                    className={`p-3 mb-2 mx-4 rounded-lg border ${
                      selectedProductIds.includes(item.id)
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-14 h-14 rounded-lg overflow-hidden mr-3">
                        <ImagePreview
                          uri={item.imagem}
                          fallbackIcon={Box}
                          containerClassName="rounded-lg"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-base">
                          {item.nome}
                        </Text>
                        {item.preco && (
                          <Text className="text-sm text-gray-600">
                            Preço: {formatCurrency(parseFloat(item.preco))}
                          </Text>
                        )}
                      </View>
                      {selectedProductIds.includes(item.id) ? (
                        <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
                          <Check size={16} color="white" />
                        </View>
                      ) : (
                        <View className="w-8 h-8 rounded-full border-2 border-gray-200" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            )}
          </View>

          {/* Modal Footer (Fixed) */}
          <View style={styles.modalFooter}>
            <Button
              onPress={() => {
                setProductModalVisible(false);
                setProductSearchTerm("");
              }}
              width="100%"
            >
              <ButtonText>
                Concluído ({selectedProductIds.length} selecionados)
              </ButtonText>
            </Button>
          </View>
        </ModalContent>
      </Modal>

      {/* Modal de Seleção de Categorias */}
      <Modal
        isOpen={categoryModalVisible}
        onClose={() => {
          setCategoryModalVisible(false);
          setCategorySearchTerm("");
        }}
        size="full"
      >
        <ModalContent style={styles.modalContainer}>
          {/* Modal Header (Fixed) */}
          <View style={styles.modalHeader}>
            <View className="flex-row items-center justify-between w-full px-4 py-3">
              <Heading size="md">Selecionar Categorias</Heading>
              <TouchableOpacity
                onPress={() => {
                  setCategoryModalVisible(false);
                  setCategorySearchTerm("");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Campo de busca (Fixed) */}
            <View className="mx-4 mb-3 bg-gray-100 rounded-lg flex-row items-center px-3 py-2">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Buscar categorias..."
                value={categorySearchTerm}
                onChangeText={setCategorySearchTerm}
              />
              {categorySearchTerm ? (
                <TouchableOpacity
                  onPress={() => setCategorySearchTerm("")}
                  className="p-1"
                >
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Modal Body (Scrollable) */}
          <View style={styles.modalBody}>
            {/* Loading State */}
            {isCategoriesLoading ? (
              <View className="p-8 items-center">
                <ActivityIndicator size="large" color={THEME_COLORS.primary} />
                <Text className="text-gray-500 mt-4">
                  Carregando categorias...
                </Text>
              </View>
            ) : filteredCategories.length === 0 ? (
              <View className="p-8 items-center">
                <Tag size={40} color="#9CA3AF" />
                <Text className="text-gray-500 mt-4 font-medium">
                  Nenhuma categoria encontrada
                </Text>
                {categorySearchTerm ? (
                  <Text className="text-gray-400 text-center mt-2">
                    Tente usar termos diferentes na sua busca
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-center mt-2">
                    Você precisa cadastrar categorias para associá-las à lista
                    de adicionais
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredCategories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleCategorySelection(Number(item.id))}
                    className={`p-4 mb-2 mx-4 rounded-lg border ${
                      selectedCategoryIds.includes(Number(item.id))
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                        <Tag size={18} color={THEME_COLORS.primary} />
                      </View>
                      <Text className="font-medium flex-1">{item.nome}</Text>
                      {selectedCategoryIds.includes(Number(item.id)) ? (
                        <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
                          <Check size={16} color="white" />
                        </View>
                      ) : (
                        <View className="w-8 h-8 rounded-full border-2 border-gray-200" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            )}
          </View>

          {/* Modal Footer (Fixed) */}
          <View style={styles.modalFooter}>
            <Button
              onPress={() => {
                setCategoryModalVisible(false);
                setCategorySearchTerm("");
              }}
              width="100%"
            >
              <ButtonText>
                Concluído ({selectedCategoryIds.length} selecionados)
              </ButtonText>
            </Button>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}

// Styles for proper modal layout
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 0,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
  },
  modalBody: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "white",
  },
});
