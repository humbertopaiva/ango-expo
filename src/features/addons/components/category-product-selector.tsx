// Path: src/features/addons/components/category-product-selector.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
} from "react-native";
import {
  Card,
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
  Filter,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SectionCard } from "@/components/custom/section-card";
import { ImagePreview } from "@/components/custom/image-preview";
import { useAddonFormData } from "../hooks/use-addon-form-data";
import { formatCurrency } from "@/src/utils/format.utils";
import { AlertCircle } from "lucide-react-native";

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

  // Usar o hook customizado para gerenciar dados
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

  // Renderizar item de produto no modal
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleProductSelection(item.id)}
      className={`p-3 mb-2 rounded-lg border ${
        selectedProductIds.includes(item.id)
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-lg overflow-hidden mr-3">
          <ImagePreview
            uri={item.imagem}
            fallbackIcon={Box}
            containerClassName="rounded-lg"
          />
        </View>
        <View className="flex-1">
          <Text className="font-medium text-base">{item.nome}</Text>
          {item.preco && (
            <Text className="text-sm text-gray-600">
              Preço: {formatCurrency(parseFloat(item.preco))}
            </Text>
          )}
        </View>
        {selectedProductIds.includes(item.id) && (
          <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
            <Check size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Renderizar item de categoria no modal - Modificado para não mostrar imagens
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategorySelection(Number(item.id))}
      className={`p-3 mb-2 rounded-lg border ${
        selectedCategoryIds.includes(Number(item.id))
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-3">
          <Tag size={16} color={THEME_COLORS.primary} />
        </View>
        <Text className="font-medium flex-1">{item.nome}</Text>
        {selectedCategoryIds.includes(Number(item.id)) && (
          <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
            <Check size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const selectedCategories = getSelectedCategories();
  const selectedProducts = getSelectedProducts();

  return (
    <View className="space-y-6">
      {/* Seção de Produtos */}
      <SectionCard
        title="Produtos Adicionais"
        icon={<Box size={20} color={THEME_COLORS.primary} />}
      >
        <View className="mb-2">
          <Text className="text-gray-600">
            Selecione quais produtos farão parte desta lista de adicionais
          </Text>
        </View>

        {/* Cards dos produtos selecionados */}
        <View className="mt-4 mb-2">
          {selectedProducts.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-lg items-center">
              <Box size={24} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                Nenhum produto selecionado
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center">
                Adicione produtos clicando no botão abaixo
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {selectedProducts.map((product) => (
                <Card key={product.id} className="p-3 bg-white">
                  <View className="flex-row items-center">
                    <View className="h-12 w-12 mr-3">
                      <ImagePreview
                        uri={product.imagem}
                        fallbackIcon={Box}
                        containerClassName="rounded-lg"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium">{product.nome}</Text>
                      {product.preco && (
                        <Text className="text-xs text-gray-600">
                          {formatCurrency(parseFloat(product.preco))}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleProductSelection(product.id)}
                      className="p-2 bg-red-50 rounded-full"
                    >
                      <CloseIcon size="sm" color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Status de carregamento ou erro */}
          {isProductsLoading && (
            <View className="p-3 bg-blue-50 rounded-lg my-2">
              <View className="flex-row items-center">
                <AlertCircle size={18} color="#1E40AF" className="mr-2" />
                <Text className="text-blue-800">Carregando produtos...</Text>
              </View>
            </View>
          )}

          {!isProductsLoading && products.length === 0 && (
            <View className="p-3 bg-yellow-50 rounded-lg my-2">
              <View className="flex-row items-center">
                <AlertCircle size={18} color="#D97706" className="mr-2" />
                <Text className="text-yellow-800">
                  Nenhum produto encontrado. Cadastre produtos primeiro.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Botão para abrir o modal de seleção de produtos */}
        <Button
          variant="outline"
          onPress={() => setProductModalVisible(true)}
          className="mt-3"
          isDisabled={isProductsLoading || products.length === 0}
        >
          <PlusCircle size={18} color={THEME_COLORS.primary} className="mr-2" />
          <ButtonText color={THEME_COLORS.primary}>
            {selectedProducts.length > 0
              ? "Gerenciar Produtos"
              : "Selecionar Produtos"}
          </ButtonText>
        </Button>
      </SectionCard>

      {/* Seção de Categorias */}
      <SectionCard
        title="Categorias"
        icon={<Tag size={20} color={THEME_COLORS.primary} />}
      >
        <View className="mb-2">
          <Text className="text-gray-600">
            Selecione para quais categorias esta lista de adicionais estará
            disponível
          </Text>
        </View>

        {/* Cards das categorias selecionadas */}
        <View className="mt-4 mb-2">
          {selectedCategories.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-lg items-center">
              <Tag size={24} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                Nenhuma categoria selecionada
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center">
                Adicione categorias clicando no botão abaixo
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {selectedCategories.map((category) => (
                <View
                  key={category.id}
                  className="m-1 bg-primary-100 rounded-full px-3 py-1 flex-row items-center"
                >
                  <Text className="text-primary-800 font-medium mr-1">
                    {category.nome}
                  </Text>
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

          {/* Status de carregamento ou erro */}
          {isCategoriesLoading && (
            <View className="p-3 bg-blue-50 rounded-lg my-2">
              <View className="flex-row items-center">
                <AlertCircle size={18} color="#1E40AF" className="mr-2" />
                <Text className="text-blue-800">Carregando categorias...</Text>
              </View>
            </View>
          )}

          {!isCategoriesLoading && categories.length === 0 && (
            <View className="p-3 bg-yellow-50 rounded-lg my-2">
              <View className="flex-row items-center">
                <AlertCircle size={18} color="#D97706" className="mr-2" />
                <Text className="text-yellow-800">
                  Nenhuma categoria encontrada. Cadastre categorias primeiro.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Botão para abrir o modal de seleção de categorias */}
        <Button
          variant="outline"
          onPress={() => setCategoryModalVisible(true)}
          className="mt-3"
          isDisabled={isCategoriesLoading || categories.length === 0}
        >
          <PlusCircle size={18} color={THEME_COLORS.primary} className="mr-2" />
          <ButtonText color={THEME_COLORS.primary}>
            {selectedCategories.length > 0
              ? "Gerenciar Categorias"
              : "Selecionar Categorias"}
          </ButtonText>
        </Button>
      </SectionCard>

      {/* Modal de Seleção de Produtos - Usando SectionList em vez de FlatList */}
      <Modal
        isOpen={productModalVisible}
        onClose={() => {
          setProductModalVisible(false);
          setProductSearchTerm("");
        }}
        size="full"
      >
        <ModalContent>
          <ModalHeader>
            <View className="flex-row items-center justify-between w-full">
              <Heading size="md">Selecionar Produtos</Heading>
              <Button
                onPress={() => {
                  setProductModalVisible(false);
                  setProductSearchTerm("");
                }}
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </Button>
            </View>
          </ModalHeader>

          <ModalBody>
            {/* Campo de busca */}
            <View className="mb-4 bg-gray-100 rounded-lg flex-row items-center px-3 py-2">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Buscar produtos..."
                value={productSearchTerm}
                onChangeText={setProductSearchTerm}
              />
              {productSearchTerm ? (
                <TouchableOpacity onPress={() => setProductSearchTerm("")}>
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Loading State */}
            {isProductsLoading ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">Carregando produtos...</Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">Nenhum produto encontrado</Text>
              </View>
            ) : (
              <SectionList
                sections={[{ title: "Produtos", data: filteredProducts }]}
                renderItem={({ item }) => renderProductItem({ item })}
                renderSectionHeader={() => null}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                stickySectionHeadersEnabled={false}
              />
            )}
          </ModalBody>

          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Seleção de Categorias - Usando SectionList em vez de FlatList */}
      <Modal
        isOpen={categoryModalVisible}
        onClose={() => {
          setCategoryModalVisible(false);
          setCategorySearchTerm("");
        }}
        size="full"
      >
        <ModalContent>
          <ModalHeader>
            <View className="flex-row items-center justify-between w-full">
              <Heading size="md">Selecionar Categorias</Heading>
              <Button
                onPress={() => {
                  setCategoryModalVisible(false);
                  setCategorySearchTerm("");
                }}
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </Button>
            </View>
          </ModalHeader>

          <ModalBody>
            {/* Campo de busca */}
            <View className="mb-4 bg-gray-100 rounded-lg flex-row items-center px-3 py-2">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Buscar categorias..."
                value={categorySearchTerm}
                onChangeText={setCategorySearchTerm}
              />
              {categorySearchTerm ? (
                <TouchableOpacity onPress={() => setCategorySearchTerm("")}>
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Loading State */}
            {isCategoriesLoading ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">Carregando categorias...</Text>
              </View>
            ) : filteredCategories.length === 0 ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">
                  Nenhuma categoria encontrada
                </Text>
              </View>
            ) : (
              <SectionList
                sections={[{ title: "Categorias", data: filteredCategories }]}
                renderItem={({ item }) => renderCategoryItem({ item })}
                renderSectionHeader={() => null}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                stickySectionHeadersEnabled={false}
              />
            )}
          </ModalBody>

          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}
