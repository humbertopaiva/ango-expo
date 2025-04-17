// Path: src/components/common/category-select-modal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import { X, Search, Check } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

export interface CategoryOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface CategorySelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  options: CategoryOption[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | null) => void;
  title?: string;
}

export function CategorySelectModal({
  isVisible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title = "Selecionar Categoria",
}: CategorySelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Filtrar opções quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Selecionar uma opção e fechar o modal
  const handleSelect = (value: string | number | null) => {
    onSelect(value);
    onClose();
  };

  // Verificar se uma opção está selecionada
  const isSelected = (value: string | number | null) => {
    return (
      value !== null &&
      value !== undefined &&
      value.toString() === selectedValue?.toString()
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header do modal */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Campo de busca */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Lista de opções */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  isSelected(item.value) && styles.selectedItem,
                  item.disabled && styles.disabledItem,
                ]}
                onPress={() => !item.disabled && handleSelect(item.value)}
                disabled={item.disabled}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected(item.value) && styles.selectedText,
                    item.disabled && styles.disabledText,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected(item.value) && (
                  <Check
                    size={20}
                    color={THEME_COLORS.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhuma categoria encontrada
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    ...Platform.select({
      web: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        borderRadius: 10,
        height: "70%",
        marginBottom: 20,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    padding: 0,
    height: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedItem: {
    backgroundColor: `${THEME_COLORS.primary}10`,
    borderRadius: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedText: {
    fontWeight: "600",
    color: THEME_COLORS.primary,
  },
  disabledText: {
    color: "#9CA3AF",
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
