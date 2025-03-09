// Path: src/features/category-page/components/modal-filter.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Subcategory } from "../models/subcategory";
import { X, Check, Filter, Grid } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { HStack } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

interface ModalFilterProps {
  isVisible: boolean;
  onClose: () => void;
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string | null) => void;
}

export function ModalFilter({
  isVisible,
  onClose,
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
}: ModalFilterProps) {
  const handleSelectSubcategory = (slug: string | null) => {
    onSelectSubcategory(slug);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer} edges={["bottom"]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          {/* Handle de arrasto */}
          <View style={styles.dragHandle}>
            <View style={styles.dragHandleBar} />
          </View>

          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Categoria</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Descrição/Instrução */}
          <Text style={styles.modalDescription}>
            Selecione uma categoria para filtrar os estabelecimentos
          </Text>

          {/* Lista de Categorias */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Opção "Todas as categorias" */}
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedSubcategory === null && styles.selectedItem,
              ]}
              onPress={() => handleSelectSubcategory(null)}
              activeOpacity={0.7}
            >
              <HStack space="md" style={styles.categoryContent}>
                <View
                  style={[
                    styles.categoryImageContainer,
                    selectedSubcategory === null &&
                      styles.selectedImageContainer,
                  ]}
                >
                  <Grid
                    size={24}
                    color={
                      selectedSubcategory === null
                        ? "white"
                        : THEME_COLORS.primary
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.categoryName,
                    selectedSubcategory === null && styles.selectedText,
                  ]}
                >
                  Todas as categorias
                </Text>
              </HStack>

              {selectedSubcategory === null && (
                <View style={styles.checkContainer}>
                  <Check size={18} color={THEME_COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>

            {/* Lista de subcategorias */}
            {subcategories.map((subcategory) => {
              const isSelected = selectedSubcategory === subcategory.slug;

              return (
                <TouchableOpacity
                  key={subcategory.id}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.selectedItem,
                  ]}
                  onPress={() => handleSelectSubcategory(subcategory.slug)}
                  activeOpacity={0.7}
                >
                  <HStack space="md" style={styles.categoryContent}>
                    <View
                      style={[
                        styles.categoryImageContainer,
                        isSelected && styles.selectedImageContainer,
                      ]}
                      className="p-2"
                    >
                      {subcategory.imagem ? (
                        <ImagePreview
                          uri={subcategory.imagem}
                          width="100%"
                          height="100%"
                          resizeMode="cover"
                        />
                      ) : (
                        <Filter
                          size={24}
                          color={isSelected ? "white" : THEME_COLORS.primary}
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {subcategory.nome}
                    </Text>
                  </HStack>

                  {isSelected && (
                    <View style={styles.checkContainer}>
                      <Check size={18} color={THEME_COLORS.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 24,
    maxHeight: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dragHandle: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragHandleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: Platform.OS === "ios" ? 500 : 450,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  selectedItem: {
    backgroundColor: `${THEME_COLORS.primary}10`,
    borderColor: THEME_COLORS.primary,
  },
  categoryContent: {
    flex: 1,
    alignItems: "center",
  },
  categoryImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: `${THEME_COLORS.primary}10`,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  selectedImageContainer: {
    backgroundColor: THEME_COLORS.primary,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#4B5563",
  },
  selectedText: {
    color: THEME_COLORS.primary,
    fontWeight: "600",
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${THEME_COLORS.primary}10`,
  },
});
