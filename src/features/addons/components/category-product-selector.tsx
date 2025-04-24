// Path: src/features/addons/components/category-product-selector.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
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
import { PlusCircle, Tag, Box, Search, Check } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SectionCard } from "@/components/custom/section-card";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import { useProducts } from "@/src/features/products/hooks/use-products";

interface CategoryProductSelectorProps {
  selectedCategories: number[];
  selectedProducts: string[];
  onCategoriesChange: (categoryIds: number[]) => void;
  onProductsChange: (productIds: string[]) => void;
}

export function CategoryProductSelector({
  selectedCategories,
  selectedProducts,
  onCategoriesChange,
  onProductsChange,
}: CategoryProductSelectorProps) {
  // Estados para os modais
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Estados para a busca
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Dados
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts();

  // Produtos filtrados pela busca
  const filteredProducts = React.useMemo(() => {
    if (!productSearchQuery.trim()) return products;
    return products.filter((product) =>
      product.nome.toLowerCase().includes(productSearchQuery.toLowerCase())
    );
  }, [products, productSearchQuery]);

  // Categorias filtradas pela busca
  const filteredCategories = React.useMemo(() => {
    if (!categorySearchQuery.trim()) return categories;
    return categories.filter((category) =>
      category.nome.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  // Manipulação de seleção
  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onProductsChange(selectedProducts.filter((id) => id !== productId));
    } else {
      onProductsChange([...selectedProducts, productId]);
    }
  };

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  // Função para obter o nome de um produto pelo ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.nome : "Produto não encontrado";
  };

  // Função para obter o nome de uma categoria pelo ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.nome : "Categoria não encontrada";
  };

  // Renderizar item de produto no modal
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleProduct(item.id)}
      className={`p-3 mb-2 rounded-lg border ${
        selectedProducts.includes(item.id)
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
              Preço: {formatCurrency(item.preco)}
            </Text>
          )}
        </View>
        {selectedProducts.includes(item.id) && (
          <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
            <Check size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Renderizar item de categoria no modal
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item.id)}
      className={`p-3 mb-2 rounded-lg border ${
        selectedCategories.includes(item.id)
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-100 items-center justify-center">
          {item.imagem ? (
            <ImagePreview
              uri={item.imagem}
              fallbackIcon={Tag}
              containerClassName="rounded-lg"
            />
          ) : (
            <Tag size={20} color="#9CA3AF" />
          )}
        </View>
        <Text className="font-medium flex-1">{item.nome}</Text>
        {selectedCategories.includes(item.id) && (
          <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
            <Check size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="space-y-6">
      {/* Seção de Produtos Selecionados */}
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
              <Text className="text-gray-500">Nenhum produto selecionado</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Adicione produtos clicando no botão abaixo
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {selectedProducts.map((productId) => (
                <Card key={productId} className="p-3 bg-white">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium">
                      {getProductName(productId)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleProduct(productId)}
                      className="p-2 bg-red-50 rounded-full"
                    >
                      <CloseIcon size="sm" color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Botão para abrir o modal de seleção de produtos */}
        <Button
          variant="outline"
          onPress={() => setProductModalVisible(true)}
          className="mt-3"
        >
          <PlusCircle size={18} color={THEME_COLORS.primary} className="mr-2" />
          <ButtonText color={THEME_COLORS.primary}>
            {selectedProducts.length > 0
              ? "Adicionar Mais Produtos"
              : "Selecionar Produtos"}
          </ButtonText>
        </Button>
      </SectionCard>

      {/* Seção de Categorias Selecionadas */}
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
              <Text className="text-gray-500">
                Nenhuma categoria selecionada
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                Adicione categorias clicando no botão abaixo
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {selectedCategories.map((categoryId) => (
                <View
                  key={categoryId}
                  className="m-1 bg-primary-100 rounded-full px-3 py-1 flex-row items-center"
                >
                  <Text className="text-primary-800 font-medium mr-1">
                    {getCategoryName(categoryId)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleCategory(categoryId)}
                    className="p-1"
                  >
                    <CloseIcon size="xs" color={THEME_COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botão para abrir o modal de seleção de categorias */}
        <Button
          variant="outline"
          onPress={() => setCategoryModalVisible(true)}
          className="mt-3"
        >
          <PlusCircle size={18} color={THEME_COLORS.primary} className="mr-2" />
          <ButtonText color={THEME_COLORS.primary}>
            {selectedCategories.length > 0
              ? "Adicionar Mais Categorias"
              : "Selecionar Categorias"}
          </ButtonText>
        </Button>
      </SectionCard>

      {/* Modal de Seleção de Produtos */}
      <Modal
        isOpen={productModalVisible}
        onClose={() => {
          setProductModalVisible(false);
          setProductSearchQuery("");
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
                  setProductSearchQuery("");
                }}
              >
                <CloseIcon />
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
                value={productSearchQuery}
                onChangeText={setProductSearchQuery}
              />
              {productSearchQuery ? (
                <TouchableOpacity onPress={() => setProductSearchQuery("")}>
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Loading State */}
            {productsLoading ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">Carregando produtos...</Text>
              </View>
            ) : filteredProducts.length === 0 ? (
              <View className="p-4 items-center">
                <Text className="text-gray-500">Nenhum produto encontrado</Text>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onPress={() => {
                setProductModalVisible(false);
                setProductSearchQuery("");
              }}
              width="100%"
            >
              <ButtonText>
                Concluído ({selectedProducts.length} selecionados)
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Seleção de Categorias */}
      <Modal
        isOpen={categoryModalVisible}
        onClose={() => {
          setCategoryModalVisible(false);
          setCategorySearchQuery("");
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
                  setCategorySearchQuery("");
                }}
              >
                <CloseIcon />
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
                value={categorySearchQuery}
                onChangeText={setCategorySearchQuery}
              />
              {categorySearchQuery ? (
                <TouchableOpacity onPress={() => setCategorySearchQuery("")}>
                  <CloseIcon size="sm" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Loading State */}
            {categoriesLoading ? (
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
              <FlatList
                data={filteredCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onPress={() => {
                setCategoryModalVisible(false);
                setCategorySearchQuery("");
              }}
              width="100%"
            >
              <ButtonText>
                Concluído ({selectedCategories.length} selecionados)
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}

// Helper function to format currency
function formatCurrency(value: string): string {
  if (!value) return "";
  try {
    const numericValue = parseFloat(value.replace(",", "."));
    if (isNaN(numericValue)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  } catch (error) {
    console.error("Error formatting currency value:", error);
    return "";
  }
}
