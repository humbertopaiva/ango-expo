// src/features/categories/screens/categories-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategoriesContext } from "../contexts/use-categories-context";
import { CategoriesList } from "../components/categories-list";
import { SearchInput } from "@/components/custom/search-input";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { useHeaderAction } from "@/src/hooks/use-header-action";

export function CategoriesContent() {
  const vm = useCategoriesContext();

  useHeaderAction({
    title: "Categorias",
    actionType: "add",
    onPress: () => router.push("/(app)/admin/categories/new"),
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* <ScreenHeader
        title="Categorias"
        subtitle="Gerencie suas categorias de produtos"
        action={{
          label: "Nova",
          onPress: () => router.push("/(app)/admin/categories/new"),
        }}
      /> */}

      <View className="flex-1 px-4">
        {/* Search */}
        <View className="mt-3">
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar categorias..."
            disabled={vm.isLoading}
          />
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false} className="pb-16">
          <CategoriesList
            categories={vm.categories}
            isLoading={vm.isLoading}
            onEdit={(category) => {
              router.push({
                pathname: "/(app)/admin/categories/[id]",
                params: { id: category.id },
              });
            }}
            onDelete={(category) => vm.handleDeleteCategory(category.id)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
