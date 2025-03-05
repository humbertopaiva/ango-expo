// src/features/leaflets/components/leaflets-filter.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Store, LayoutGrid, X } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { ResilientImage } from "@/components/common/resilient-image";
import { Company, Category } from "../models/leaflet";

interface LeafletsFilterProps {
  companies: Company[];
  categories: Category[];
  selectedCompany: string | null;
  selectedCategory: string | null;
  onSelectCompany: (slug: string | null) => void;
  onSelectCategory: (slug: string | null) => void;
  isLoading: boolean;
  onClearFilters?: () => void;
}

export function LeafletsFilter({
  companies,
  categories,
  selectedCompany,
  selectedCategory,
  onSelectCompany,
  onSelectCategory,
  isLoading,
  onClearFilters,
}: LeafletsFilterProps) {
  if (isLoading) {
    return (
      <View className="space-y-4">
        <View className="h-10 w-32 rounded-full bg-gray-200 animate-pulse" />
        <View className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
      </View>
    );
  }

  // Encontrar o nome da categoria selecionada
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    return categories.find((cat) => cat.slug === selectedCategory)?.nome;
  };

  // Encontrar o nome da empresa selecionada
  const getSelectedCompanyName = () => {
    if (!selectedCompany) return null;
    return companies.find((comp) => comp.slug === selectedCompany)?.nome;
  };

  return (
    <View className="space-y-4 mb-2">
      {/* Filtros ativos e botão limpar */}
      {(selectedCompany || selectedCategory) && (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">Filtros:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {selectedCompany && (
                  <TouchableOpacity
                    onPress={() => onSelectCompany(null)}
                    className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full mr-2"
                  >
                    <Text className="text-sm text-gray-700 mr-1">
                      {getSelectedCompanyName()}
                    </Text>
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                )}
                {selectedCategory && (
                  <TouchableOpacity
                    onPress={() => onSelectCategory(null)}
                    className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full mr-2"
                  >
                    <Text className="text-sm text-gray-700 mr-1">
                      {getSelectedCategoryName()}
                    </Text>
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
          <Button
            variant="outline"
            size="sm"
            onPress={onClearFilters}
            className="py-1"
          >
            <ButtonText className="text-xs">Limpar</ButtonText>
          </Button>
        </View>
      )}

      {/* Categorias */}
      <View>
        <Text className="text-base font-medium mb-2">Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === null
                ? "bg-primary-500"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedCategory === null ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              Todas
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => onSelectCategory(category.slug)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.slug
                  ? "bg-primary-500"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              <Text
                className={`${
                  selectedCategory === category.slug
                    ? "text-white"
                    : "text-gray-800"
                } font-medium`}
              >
                {category.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Empresas */}
      <View>
        <Text className="text-base font-medium mb-2">Empresas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => onSelectCompany(null)}
            className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
              selectedCompany === null
                ? "bg-primary-500"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <Store
              size={16}
              color={selectedCompany === null ? "white" : "#6B7280"}
            />
            <Text
              className={`ml-2 ${
                selectedCompany === null ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              Todas
            </Text>
          </TouchableOpacity>

          {companies.map((company) => (
            <TouchableOpacity
              key={company.slug}
              onPress={() => onSelectCompany(company.slug)}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                selectedCompany === company.slug
                  ? "bg-primary-500"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              <View className="w-5 h-5 rounded-full overflow-hidden bg-gray-200">
                <ResilientImage
                  source={company.logo}
                  style={{ width: 20, height: 20 }}
                  fallbackSource={<Store size={12} color="#6B7280" />}
                />
              </View>
              <Text
                className={`ml-2 ${
                  selectedCompany === company.slug
                    ? "text-white"
                    : "text-gray-800"
                } font-medium`}
              >
                {company.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
