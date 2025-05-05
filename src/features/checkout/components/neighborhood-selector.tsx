// Path: src/features/checkout/components/neighborhood-selector.tsx

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectItem,
  SelectContent,
  SelectIcon,
  Icon,
  ChevronDownIcon,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { MapPin } from "lucide-react-native";
import { DeliveryInfoService } from "../../cart/services/delivery-info.service";

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
  const [open, setOpen] = useState(false);

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
      <View className="mb-1">
        <Text className="font-medium text-gray-700 flex-row items-center">
          <MapPin size={16} color="#6B7280" /> Selecione seu bairro
        </Text>
      </View>

      <Select
        selectedValue={selectedNeighborhood}
        onValueChange={(value) => onSelectNeighborhood(value)}
      >
        <SelectTrigger className="h-12 border border-gray-300 rounded-lg bg-white px-3">
          <SelectInput placeholder="Selecione seu bairro" />
          <SelectIcon>
            <Icon as={ChevronDownIcon} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent>
            {neighborhoods.map((neighborhood) => (
              <SelectItem
                key={neighborhood}
                label={neighborhood}
                value={neighborhood}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>

      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
