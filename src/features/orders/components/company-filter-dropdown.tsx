// Path: src/features/orders/components/company-filter-dropdown.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Card, HStack } from "@gluestack-ui/themed";
import { ChevronDown, Check, Store, X } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

// Interfaces definidas explicitamente
type Company = {
  id: string;
  slug: string;
  name: string;
};

type CompanyFilterDropdownProps = {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
};

export function CompanyFilterDropdown({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanyFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const primaryColor = THEME_COLORS.primary;

  // Lidar com a seleção de empresa
  const handleSelectItem = (
    item: Company | { id: "all"; slug: "all"; name: "Todas as empresas" }
  ) => {
    if (item.id === "all") {
      onSelectCompany(null);
    } else {
      onSelectCompany(item as Company);
    }
    setIsOpen(false);
  };

  return (
    <View className="mx-4 mb-4">
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="p-3 border border-gray-200 rounded-lg bg-white"
      >
        <HStack className="justify-between items-center">
          <HStack space="sm" alignItems="center">
            <Store size={18} color={primaryColor} />
            <Text className="text-gray-800 font-medium">
              {selectedCompany ? selectedCompany.name : "Todas as empresas"}
            </Text>
          </HStack>
          <ChevronDown size={18} color="#6B7280" />
        </HStack>
      </TouchableOpacity>

      {isOpen && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <View className="flex-1 bg-black/50 justify-center p-4">
            <Card className="bg-white rounded-xl overflow-hidden">
              <HStack className="p-4 border-b border-gray-100 justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  Filtrar por empresa
                </Text>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </HStack>

              <FlatList
                data={[
                  { id: "all", slug: "all", name: "Todas as empresas" },
                  ...companies,
                ]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected =
                    (selectedCompany === null && item.id === "all") ||
                    (selectedCompany && selectedCompany.id === item.id);

                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectItem(item)}
                      className="p-4 border-b border-gray-100"
                    >
                      <HStack className="justify-between items-center">
                        <HStack space="sm" alignItems="center">
                          <Store
                            size={18}
                            color={item.id === "all" ? "#6B7280" : primaryColor}
                          />
                          <Text className="text-gray-800">{item.name}</Text>
                        </HStack>

                        {isSelected && <Check size={18} color={primaryColor} />}
                      </HStack>
                    </TouchableOpacity>
                  );
                }}
              />
            </Card>
          </View>
        </Modal>
      )}
    </View>
  );
}
