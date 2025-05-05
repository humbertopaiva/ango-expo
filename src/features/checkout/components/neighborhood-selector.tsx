// Path: src/features/checkout/components/neighborhood-selector.tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { MapPin, ChevronDown } from "lucide-react-native";
import { NeighborhoodModal } from "./neighborhood-modal";

interface NeighborhoodSelectorProps {
  neighborhoods: string[];
  selectedNeighborhood: string;
  onSelectNeighborhood: (neighborhood: string) => void;
  primaryColor: string;
  error?: string;
  isRequired?: boolean;
}

export function NeighborhoodSelector({
  neighborhoods,
  selectedNeighborhood,
  onSelectNeighborhood,
  primaryColor,
  error,
  isRequired = true,
}: NeighborhoodSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Se não houver nenhum bairro selecionado mas houver bairros disponíveis,
  // seleciona o primeiro automaticamente
  useEffect(() => {
    if (!selectedNeighborhood && neighborhoods.length > 0) {
      onSelectNeighborhood(neighborhoods[0]);
    }
  }, [neighborhoods, selectedNeighborhood, onSelectNeighborhood]);

  // Se não houver bairros, exibe mensagem
  if (neighborhoods.length === 0) {
    return (
      <View className="p-3 rounded-lg bg-amber-50 border border-amber-200 my-2">
        <Text className="text-amber-800">
          Não há bairros disponíveis para entrega.
        </Text>
      </View>
    );
  }

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="h-12 border border-gray-300 rounded-lg bg-white px-3 flex-row justify-between items-center"
      >
        <View className="flex-row items-center">
          <MapPin size={16} color="#6B7280" className="mr-2" />
          <Text
            className={`${
              selectedNeighborhood ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {selectedNeighborhood || "Selecione seu bairro"}
          </Text>
        </View>
        <ChevronDown size={18} color="#6B7280" />
      </TouchableOpacity>

      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}

      <NeighborhoodModal
        isVisible={modalVisible}
        neighborhoods={neighborhoods}
        selectedNeighborhood={selectedNeighborhood}
        onSelectNeighborhood={onSelectNeighborhood}
        onClose={() => setModalVisible(false)}
      />
    </FormControl>
  );
}
