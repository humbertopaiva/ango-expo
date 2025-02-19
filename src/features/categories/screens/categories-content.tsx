// src/features/categories/screens/categories-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategoriesContext } from "../contexts/use-categories-context";
import { CategoriesList } from "../components/categories-list";
import { Plus, Search } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import { router, RelativePathString } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";

export function CategoriesContent() {
  const vm = useCategoriesContext();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4">
        {/* Header */}
        <ScreenHeader
          title="Categorias"
          subtitle="Gerencie as categorias de produtos da sua loja"
          action={{
            label: "Nova Categoria",
            icon: Plus,
            onPress: () => router.push("/(app)/admin/categories/new"),
          }}
        />

        {/* Search */}
        <View className="mb-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={20} color="#6B7280" />
            </View>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Enter Text here..."
                value={vm.searchTerm}
                onChangeText={vm.setSearchTerm}
                className="pl-10"
              />
            </Input>
            <Input />
          </View>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <CategoriesList
            categories={vm.categories}
            isLoading={vm.isLoading}
            onEdit={(category) => {
              vm.setSelectedCategory(category);
              vm.setIsFormVisible(true);
            }}
            onDelete={(category) => vm.handleDeleteCategory(category.id)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
