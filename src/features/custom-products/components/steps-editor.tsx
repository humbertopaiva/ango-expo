// Path: src/features/custom-products/components/steps-editor.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput as RNTextInput,
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
  Input,
  InputField,
  TextareaInput,
} from "@gluestack-ui/themed";
import {
  PlusCircle,
  Package,
  Search,
  Check,
  Trash,
  Plus,
  Minus,
  MoveUp,
  MoveDown,
  Box,
  Tag,
  FileText,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SectionCard } from "@/components/custom/section-card";
import { ImagePreview } from "@/components/custom/image-preview";
import { CustomProductStep } from "../models/custom-product";
import { useCustomProductForm } from "../hooks/use-custom-product-form";
import { formatCurrency } from "@/src/utils/format.utils";

interface StepsEditorProps {
  initialSteps?: CustomProductStep[];
  onStepsChange: (steps: CustomProductStep[]) => void;
}

export function StepsEditor({
  initialSteps = [],
  onStepsChange,
}: StepsEditorProps) {
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  const {
    steps,
    addStep,
    removeStep,
    updateStepQuantity,
    updateStepName,
    updateStepDescription,
    addProductToStep,
    removeProductFromStep,
    products,
    filteredProducts,
    isProductsLoading,
    searchTerm,
    setSearchTerm,
  } = useCustomProductForm(initialSteps);

  // Notificar mudanças nos passos
  React.useEffect(() => {
    // Importante: Só notifique se os passos realmente mudarem
    if (steps && steps.length > 0) {
      console.log("Notificando mudanças nos passos:", steps.length);
      onStepsChange(steps);
    }
  }, [steps, onStepsChange]);

  // Adicione um log para verificar os initialSteps recebidos
  React.useEffect(() => {
    console.log(
      "initialSteps recebidos no StepsEditor:",
      initialSteps ? initialSteps.length : 0,
      JSON.stringify(initialSteps)
    );
  }, [initialSteps]);

  // Função para mostrar o seletor de produtos para um passo específico
  const openProductSelector = (stepNumber: number) => {
    setCurrentStepIndex(stepNumber);
    setProductSelectorVisible(true);
  };

  // Mover um passo para cima
  const moveStepUp = (index: number) => {
    if (index <= 0) return;

    const newSteps = [...steps];
    // Trocar o passo atual com o anterior
    [newSteps[index - 1], newSteps[index]] = [
      newSteps[index],
      newSteps[index - 1],
    ];

    // Atualizar os números dos passos
    newSteps.forEach((step, i) => {
      step.passo_numero = i + 1;
    });

    onStepsChange(newSteps);
  };

  // Mover um passo para baixo
  const moveStepDown = (index: number) => {
    if (index >= steps.length - 1) return;

    const newSteps = [...steps];
    // Trocar o passo atual com o próximo
    [newSteps[index], newSteps[index + 1]] = [
      newSteps[index + 1],
      newSteps[index],
    ];

    // Atualizar os números dos passos
    newSteps.forEach((step, i) => {
      step.passo_numero = i + 1;
    });

    onStepsChange(newSteps);
  };

  // Renderizar um passo
  const renderStep = (step: CustomProductStep, index: number) => {
    return (
      <Card key={step.passo_numero} className="mb-4 p-4 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <View className="bg-primary-100 px-3 py-1 rounded-full">
            <Text className="text-primary-800 font-medium">
              Passo {step.passo_numero}
            </Text>
          </View>

          <View className="flex-row">
            {index > 0 && (
              <TouchableOpacity
                onPress={() => moveStepUp(index)}
                className="p-2 mr-1"
              >
                <MoveUp size={20} color="#6B7280" />
              </TouchableOpacity>
            )}

            {index < steps.length - 1 && (
              <TouchableOpacity
                onPress={() => moveStepDown(index)}
                className="p-2 mr-1"
              >
                <MoveDown size={20} color="#6B7280" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => removeStep(step.passo_numero)}
              className="p-2 bg-red-50 rounded-full"
            >
              <Trash size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nome do passo */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Tag size={16} color="#374151" className="mr-2" />
            <Text className="text-gray-700 font-medium">Nome do passo:</Text>
          </View>
          <Input>
            <InputField
              placeholder={`Nome do passo ${step.passo_numero}`}
              value={step.nome || ""}
              onChangeText={(text) => updateStepName(step.passo_numero, text)}
              className="bg-white"
            />
          </Input>
        </View>

        {/* Descrição do passo */}
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <FileText size={16} color="#374151" className="mr-2" />
            <Text className="text-gray-700 font-medium">
              Descrição do passo:
            </Text>
          </View>
          <Input>
            <InputField
              placeholder="Descreva este passo de personalização"
              value={step.descricao || ""}
              onChangeText={(text) =>
                updateStepDescription(step.passo_numero, text)
              }
              multiline={true}
              numberOfLines={3}
              className="bg-white min-h-[80px] text-base py-2 px-3"
            />
          </Input>
        </View>

        {/* Configuração de quantidade */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">
            Quantidade de itens a selecionar:
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                if (step.qtd_items_step > 1) {
                  updateStepQuantity(
                    step.passo_numero,
                    step.qtd_items_step - 1
                  );
                }
              }}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              disabled={step.qtd_items_step <= 1}
            >
              <Minus
                size={20}
                color={step.qtd_items_step <= 1 ? "#D1D5DB" : "#374151"}
              />
            </TouchableOpacity>

            <Text className="mx-4 text-lg font-medium">
              {step.qtd_items_step}
            </Text>

            <TouchableOpacity
              onPress={() =>
                updateStepQuantity(step.passo_numero, step.qtd_items_step + 1)
              }
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Plus size={20} color="#374151" />
            </TouchableOpacity>

            <Text className="ml-4 text-gray-500">
              Itens que o cliente poderá escolher neste passo
            </Text>
          </View>
        </View>

        {/* Lista de produtos no passo */}
        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-medium text-gray-800">
              Produtos deste passo
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => openProductSelector(step.passo_numero)}
            >
              <View className="flex-row items-center">
                <PlusCircle size={16} color={THEME_COLORS.primary} />
                <ButtonText className="ml-1" color={THEME_COLORS.primary}>
                  Adicionar produtos
                </ButtonText>
              </View>
            </Button>
          </View>

          {step.produtos.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-lg items-center">
              <Package size={24} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">
                Nenhum produto adicionado a este passo
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center">
                Adicione produtos clicando no botão acima
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {step.produtos.map((productItem, productIndex) => {
                // Encontrar os detalhes do produto pelo ID
                const productDetails = products.find(
                  (p) => p.id === productItem.produtos.key
                );

                if (!productDetails) return null;

                return (
                  <View
                    key={`${step.passo_numero}-${productIndex}`}
                    className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <View className="h-12 w-12 mr-3">
                      <ImagePreview
                        uri={productDetails.imagem}
                        fallbackIcon={Box}
                        containerClassName="rounded-lg"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium">{productDetails.nome}</Text>
                      {productDetails.preco && (
                        <Text className="text-xs text-gray-600">
                          {formatCurrency(parseFloat(productDetails.preco))}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        removeProductFromStep(
                          step.passo_numero,
                          productItem.produtos.key
                        )
                      }
                      className="p-2 bg-red-50 rounded-full"
                    >
                      <Trash size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View className="space-y-4">
      <SectionCard
        title="Passos de Personalização"
        icon={<Package size={20} color={THEME_COLORS.primary} />}
      >
        <View className="mb-4">
          <Text className="text-gray-600">
            Configure os passos de personalização com nome, descrição e os
            produtos disponíveis em cada um
          </Text>
        </View>

        {/* Lista de passos */}
        <View className="mt-2 mb-4">
          {steps.length === 0 ? (
            <View className="p-6 bg-gray-50 rounded-lg items-center">
              <Package size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-lg font-medium">
                Nenhum passo configurado
              </Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                Adicione passos para que o cliente possa personalizar o produto
              </Text>
            </View>
          ) : (
            <View>{steps.map((step, index) => renderStep(step, index))}</View>
          )}
        </View>

        {/* Botão para adicionar novo passo */}
        <Button variant="outline" onPress={addStep} className="mt-2">
          <View className="flex-row items-center">
            <PlusCircle size={18} color={THEME_COLORS.primary} />
            <ButtonText className="ml-2" color={THEME_COLORS.primary}>
              {steps.length > 0
                ? "Adicionar outro passo"
                : "Adicionar primeiro passo"}
            </ButtonText>
          </View>
        </Button>
      </SectionCard>

      {/* Modal de seleção de produtos */}
      <Modal
        isOpen={productSelectorVisible}
        onClose={() => {
          setProductSelectorVisible(false);
          setSearchTerm("");
          setCurrentStepIndex(null);
        }}
        size="full"
      >
        <ModalContent style={styles.modalContainer}>
          {/* Modal Header (Fixed) */}
          <View style={styles.modalHeader}>
            <View className="flex-row items-center justify-between w-full px-4 py-3">
              <Heading size="md">Selecionar Produtos</Heading>
              <Button
                onPress={() => {
                  setProductSelectorVisible(false);
                  setSearchTerm("");
                  setCurrentStepIndex(null);
                }}
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </Button>
            </View>

            {/* Campo de busca (Fixed) */}
            <View className="mx-4 mb-3">
              <Input variant="outline" className="bg-gray-100">
                <InputField
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="text-base"
                />
              </Input>
            </View>
          </View>

          {/* Modal Body (Scrollable) */}
          <View style={styles.modalBody}>
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
              <FlatList
                data={filteredProducts}
                renderItem={({ item }) => {
                  // Verificar se o produto já foi adicionado a este passo
                  const currentStep = steps.find(
                    (s) => s.passo_numero === currentStepIndex
                  );
                  const isSelected =
                    currentStep?.produtos.some(
                      (p) => p.produtos.key === item.id
                    ) || false;

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (currentStepIndex !== null) {
                          if (isSelected) {
                            removeProductFromStep(currentStepIndex, item.id);
                          } else {
                            addProductToStep(currentStepIndex, item);
                          }
                        }
                      }}
                      className={`p-3 mb-2 mx-4 rounded-lg border ${
                        isSelected
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
                          <Text className="font-medium text-base">
                            {item.nome}
                          </Text>
                          {item.preco && (
                            <Text className="text-sm text-gray-600">
                              Preço: {formatCurrency(parseFloat(item.preco))}
                            </Text>
                          )}
                        </View>
                        {isSelected && (
                          <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
                            <Check size={16} color="white" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
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
                setProductSelectorVisible(false);
                setSearchTerm("");
                setCurrentStepIndex(null);
              }}
              width="100%"
            >
              <ButtonText>
                Concluído (
                {currentStepIndex !== null
                  ? steps.find((s) => s.passo_numero === currentStepIndex)
                      ?.produtos.length || 0
                  : 0}{" "}
                selecionados)
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
