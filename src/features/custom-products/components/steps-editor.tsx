// Path: src/features/custom-products/components/steps-editor.tsx
import React, { useState, useCallback, useRef, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Heading,
  CloseIcon,
  Input,
  InputField,
  ButtonText,
} from "@gluestack-ui/themed";
import {
  PlusCircle,
  Package,
  Check,
  Trash,
  Plus,
  Minus,
  MoveUp,
  MoveDown,
  Box,
  Tag,
  FileText,
  Search,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { SectionCard } from "@/components/custom/section-card";
import { ImagePreview } from "@/components/custom/image-preview";
import { CustomProductStep } from "../models/custom-product";
import { useCustomProductForm } from "../hooks/use-custom-product-form";
import { formatCurrency } from "@/src/utils/format.utils";
import { Product } from "@/src/features/products/models/product";

interface StepsEditorProps {
  initialSteps?: CustomProductStep[];
  onStepsChange: (steps: CustomProductStep[]) => void;
}

// Componente de passo memoizado para evitar re-renderização desnecessária
const StepItem = memo(
  ({
    step,
    index,
    onNameChange,
    onDescriptionChange,
    onUpdateQuantity,
    onRemoveStep,
    onMoveUp,
    onMoveDown,
    onOpenProductSelector,
    onRemoveProduct,
    products,
    isLastStep,
    isFirstStep,
  }: {
    step: CustomProductStep;
    index: number;
    onNameChange: (stepNumber: number, name: string) => void;
    onDescriptionChange: (stepNumber: number, description: string) => void;
    onUpdateQuantity: (stepNumber: number, quantity: number) => void;
    onRemoveStep: (stepNumber: number) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    onOpenProductSelector: (stepNumber: number) => void;
    onRemoveProduct: (stepNumber: number, productKey: string) => void;
    products: Product[];
    isLastStep: boolean;
    isFirstStep: boolean;
  }) => {
    // Estado local para o input para evitar re-renderizações
    const [name, setName] = useState(step.nome || `Passo ${step.passo_numero}`);
    const [description, setDescription] = useState(step.descricao || "");
    const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleNameChange = (text: string) => {
      setName(text);

      // Limpar timeout anterior se existir
      if (nameTimeoutRef.current) {
        clearTimeout(nameTimeoutRef.current);
      }

      // Criar novo timeout
      nameTimeoutRef.current = setTimeout(() => {
        onNameChange(step.passo_numero, text);
      }, 500);
    };

    const handleDescriptionChange = (text: string) => {
      setDescription(text);

      // Limpar timeout anterior se existir
      if (descriptionTimeoutRef.current) {
        clearTimeout(descriptionTimeoutRef.current);
      }

      // Criar novo timeout
      descriptionTimeoutRef.current = setTimeout(() => {
        onDescriptionChange(step.passo_numero, text);
      }, 500);
    };

    return (
      <Card className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Cabeçalho do passo */}
        <View className="p-4 bg-gray-50 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-primary-100 h-9 w-9 rounded-full items-center justify-center mr-2">
                <Text className="text-primary-800 font-semibold">
                  {step.passo_numero}
                </Text>
              </View>
              <Text className="font-medium text-gray-800">
                {name || `Passo ${step.passo_numero}`}
              </Text>
            </View>

            <View className="flex-row">
              {!isFirstStep && (
                <TouchableOpacity
                  onPress={() => onMoveUp(index)}
                  className="p-2 bg-gray-100 rounded-md mr-1"
                >
                  <MoveUp size={18} color="#6B7280" />
                </TouchableOpacity>
              )}

              {!isLastStep && (
                <TouchableOpacity
                  onPress={() => onMoveDown(index)}
                  className="p-2 bg-gray-100 rounded-md mr-1"
                >
                  <MoveDown size={18} color="#6B7280" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => onRemoveStep(step.passo_numero)}
                className="p-2 bg-red-50 rounded-md"
              >
                <Trash size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="p-4">
          {/* Nome do passo */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2 gap-2">
              <Tag size={16} color="#374151" className="mr-2" />
              <Text className="text-gray-700 font-medium">Nome do passo:</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder={`Nome do passo ${step.passo_numero}`}
              value={name}
              onChangeText={handleNameChange}
            />
          </View>

          {/* Descrição do passo */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2 gap-2">
              <FileText size={16} color="#374151" className="mr-2" />
              <Text className="text-gray-700 font-medium">
                Descrição do passo:
              </Text>
            </View>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Descreva este passo de personalização"
              value={description}
              onChangeText={handleDescriptionChange}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Configuração de quantidade */}
          <View className="mb-4 bg-gray-50 p-3 rounded-lg">
            <Text className="text-gray-700 font-medium mb-2">
              Quantidade de itens a selecionar:
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  if (step.qtd_items_step > 1) {
                    onUpdateQuantity(
                      step.passo_numero,
                      step.qtd_items_step - 1
                    );
                  }
                }}
                className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
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
                  onUpdateQuantity(step.passo_numero, step.qtd_items_step + 1)
                }
                className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
              >
                <Plus size={20} color="#374151" />
              </TouchableOpacity>

              <Text className="ml-4 text-gray-500 flex-1">
                Itens que o cliente poderá escolher neste passo
              </Text>
            </View>
          </View>

          {/* Lista de produtos no passo */}
          <View>
            <View className="flex-col justify-between mb-3 gap-2">
              <Text className="font-medium text-gray-800">
                Produtos deste passo
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => onOpenProductSelector(step.passo_numero)}
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
              <View className="p-6 bg-gray-50 rounded-lg items-center">
                <Package size={24} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 font-medium">
                  Nenhum produto adicionado
                </Text>
                <Text className="text-gray-500 text-sm mt-1 text-center">
                  Adicione produtos para este passo de personalização
                </Text>
              </View>
            ) : (
              <View className="gap-2">
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
                        <Text className="font-medium text-gray-800">
                          {productDetails.nome}
                        </Text>
                        {productDetails.preco && (
                          <View className="flex-row items-center">
                            <Tag size={12} color="#6B7280" className="mr-1" />
                            <Text className="text-sm text-gray-600">
                              {formatCurrency(parseFloat(productDetails.preco))}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          onRemoveProduct(
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
        </View>
      </Card>
    );
  }
);

export function StepsEditor({
  initialSteps = [],
  onStepsChange,
}: StepsEditorProps) {
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  // Referência para evitar causar re-renderizações por causa do efeito de notificação
  const notifiedStepsRef = useRef<string>("");

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

  // Notificar mudanças nos passos - usando um efeito controlado com comparação profunda
  React.useEffect(() => {
    // Converte os passos para string para comparação profunda
    const stepsAsString = JSON.stringify(steps);

    // Só notifica se os passos mudaram
    if (
      steps &&
      steps.length > 0 &&
      stepsAsString !== notifiedStepsRef.current
    ) {
      console.log("Notificando mudanças nos passos:", steps.length);
      onStepsChange(steps);
      // Atualiza a referência com os passos atuais
      notifiedStepsRef.current = stepsAsString;
    }
  }, [steps, onStepsChange]);

  // Função para mostrar o seletor de produtos para um passo específico
  const openProductSelector = useCallback((stepNumber: number) => {
    setCurrentStepIndex(stepNumber);
    setProductSelectorVisible(true);
  }, []);

  // Mover um passo para cima - usando referência direta ao passo em vez de índice
  const moveStepUp = useCallback(
    (index: number) => {
      if (index <= 0) return;

      // Clone os passos atuais
      const newSteps = [...steps];

      // Troque a posição dos passos
      [newSteps[index - 1], newSteps[index]] = [
        newSteps[index],
        newSteps[index - 1],
      ];

      // Atualize os números dos passos
      newSteps.forEach((step, i) => {
        step.passo_numero = i + 1;
      });

      // Notifique a mudança
      onStepsChange(newSteps);
    },
    [steps, onStepsChange]
  );

  // Mover um passo para baixo
  const moveStepDown = useCallback(
    (index: number) => {
      if (index >= steps.length - 1) return;

      // Clone os passos atuais
      const newSteps = [...steps];

      // Troque a posição dos passos
      [newSteps[index], newSteps[index + 1]] = [
        newSteps[index + 1],
        newSteps[index],
      ];

      // Atualize os números dos passos
      newSteps.forEach((step, i) => {
        step.passo_numero = i + 1;
      });

      // Notifique a mudança
      onStepsChange(newSteps);
    },
    [steps, onStepsChange]
  );

  return (
    <View className="gap-4">
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
            <View>
              {steps.map((step, index) => (
                <StepItem
                  key={`step-${step.passo_numero}-${index}`}
                  step={step}
                  index={index}
                  onNameChange={updateStepName}
                  onDescriptionChange={updateStepDescription}
                  onUpdateQuantity={updateStepQuantity}
                  onRemoveStep={removeStep}
                  onMoveUp={moveStepUp}
                  onMoveDown={moveStepDown}
                  onOpenProductSelector={openProductSelector}
                  onRemoveProduct={removeProductFromStep}
                  products={products}
                  isFirstStep={index === 0}
                  isLastStep={index === steps.length - 1}
                />
              ))}
            </View>
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
              <TouchableOpacity
                onPress={() => {
                  setProductSelectorVisible(false);
                  setSearchTerm("");
                  setCurrentStepIndex(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <CloseIcon color={THEME_COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Campo de busca (Fixed) */}
            <View className="mx-4 mb-3 bg-gray-100 rounded-lg flex-row items-center px-3 py-2">
              <Search size={20} color="#6B7280" />
              <Input className="flex-1 ml-2">
                <InputField
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  className="text-base"
                />
              </Input>
              {searchTerm ? (
                <TouchableOpacity
                  onPress={() => setSearchTerm("")}
                  className="p-1"
                >
                  <CloseIcon size="sm" color="#6B7280" />
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
                <Text className="text-gray-700 font-medium text-lg mt-4">
                  Nenhum produto encontrado
                </Text>
                {searchTerm ? (
                  <Text className="text-gray-500 text-center mt-2">
                    Tente usar termos diferentes na sua busca
                  </Text>
                ) : (
                  <Text className="text-gray-500 text-center mt-2">
                    Você precisa cadastrar produtos para associá-los aos passos
                  </Text>
                )}
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
                          ? "border-primary-300 bg-primary-50"
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
                          <Text className="font-medium text-base text-gray-800">
                            {item.nome}
                          </Text>
                          {item.preco && (
                            <View className="flex-row items-center mt-1">
                              <Tag
                                size={14}
                                color={THEME_COLORS.primary}
                                className="mr-1"
                              />
                              <Text className="text-primary-700 font-medium">
                                {formatCurrency(parseFloat(item.preco))}
                              </Text>
                            </View>
                          )}
                          {item.descricao && (
                            <Text
                              numberOfLines={1}
                              className="text-gray-500 text-sm mt-1"
                            >
                              {item.descricao}
                            </Text>
                          )}
                        </View>
                        <View className="ml-2">
                          {isSelected ? (
                            <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
                              <Check size={16} color="white" />
                            </View>
                          ) : (
                            <View className="w-8 h-8 rounded-full border-2 border-gray-200" />
                          )}
                        </View>
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
              className="bg-primary-500"
            >
              <ButtonText>
                Concluído (
                {currentStepIndex !== null
                  ? steps.find((s) => s.passo_numero === currentStepIndex)
                      ?.produtos.length || 0
                  : 0}{" "}
                produtos selecionados)
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
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1F2937",
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1F2937",
    minHeight: 80,
    textAlignVertical: "top",
  },
});
