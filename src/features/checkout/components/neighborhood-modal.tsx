// Path: src/features/checkout/components/neighborhood-modal.tsx

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { X, Search, MapPin, CheckCircle } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface NeighborhoodModalProps {
  isVisible: boolean;
  neighborhoods: string[];
  selectedNeighborhood: string;
  onSelectNeighborhood: (neighborhood: string) => void;
  onClose: () => void;
}

export function NeighborhoodModal({
  isVisible,
  neighborhoods,
  selectedNeighborhood,
  onSelectNeighborhood,
  onClose,
}: NeighborhoodModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const primaryColor = THEME_COLORS.primary;

  // Filtrar bairros com base na pesquisa
  const filteredNeighborhoods = neighborhoods.filter((neighborhood) =>
    neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para selecionar um bairro e fechar o modal
  const handleSelect = (neighborhood: string) => {
    onSelectNeighborhood(neighborhood);
    onClose();
  };

  // Renderizar um item de bairro
  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedNeighborhood;

    return (
      <TouchableOpacity
        className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
          isSelected ? "bg-primary-50" : ""
        }`}
        onPress={() => handleSelect(item)}
      >
        <View className="flex-row items-center">
          <MapPin
            size={18}
            color={isSelected ? primaryColor : "#6B7280"}
            className="mr-3"
          />
          <Text
            className={`${
              isSelected ? "text-primary-600 font-medium" : "text-gray-700"
            }`}
          >
            {item}
          </Text>
        </View>
        {isSelected && <CheckCircle size={18} color={primaryColor} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">
              Selecione o Bairro
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Campo de Pesquisa */}
          <View className="px-4 py-3 border-b border-gray-200">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 pl-2 text-gray-700"
                placeholder="Buscar bairro..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista de Bairros */}
          {neighborhoods.length > 0 ? (
            <FlatList
              data={filteredNeighborhoods}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-gray-500 text-center">
                Nenhum bairro disponível
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
