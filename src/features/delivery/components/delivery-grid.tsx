// Path: src/features/delivery/components/delivery-grid.tsx
import React from "react";
import { View, Text, Platform, Dimensions } from "react-native";
import { DeliveryProfile } from "../models/delivery-profile";
import { DeliveryCard } from "./delivery-card";
import { DeliverySkeleton } from "./delivery-skeleton";
import { Subcategory } from "../models/subcategory";

interface DeliveryGridProps {
  profiles: DeliveryProfile[];
  isLoading: boolean;
  groupByCategory?: boolean;
  subcategories?: Subcategory[];
}

export function DeliveryGrid({
  profiles,
  isLoading,
  groupByCategory = false,
  subcategories = [],
}: DeliveryGridProps) {
  const { width } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";

  // Fixo em 2 colunas para todos os tamanhos, exceto telas muito pequenas no mobile
  const columnCount = width < 500 ? 1 : 2;

  // Renderiza o skeleton durante o carregamento
  if (isLoading) {
    return <DeliverySkeleton count={6} />;
  }

  // Se não tiver perfis para mostrar
  if (!profiles || profiles.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <Text className="text-gray-500 text-center">
          Nenhum estabelecimento encontrado.
        </Text>
      </View>
    );
  }

  // Se estiver agrupando por categoria
  if (groupByCategory && subcategories.length > 0) {
    // Cria um objeto de mapeamento para categorias
    const categoriesMap = subcategories.reduce((map, category) => {
      if (category.id && category.slug) {
        map[category.slug] = {
          ...category,
          profiles: [],
        };
      }
      return map;
    }, {} as Record<string, Subcategory & { profiles: DeliveryProfile[] }>);

    // Agrupa os perfis por categoria
    profiles.forEach((profile) => {
      if (profile.empresa && profile.empresa.subcategorias) {
        let assigned = false;

        // Procura as subcategorias do perfil
        profile.empresa.subcategorias.forEach((sub) => {
          if (
            sub &&
            sub.subcategorias_empresas_id &&
            sub.subcategorias_empresas_id.slug
          ) {
            const catSlug = sub.subcategorias_empresas_id.slug;

            // Se a categoria existe no nosso mapa, adiciona o perfil
            if (categoriesMap[catSlug]) {
              categoriesMap[catSlug].profiles.push(profile);
              assigned = true;
            }
          }
        });

        // Se não foi atribuído a nenhuma categoria, adiciona à categoria "Outros"
        if (!assigned) {
          if (!categoriesMap["outros"]) {
            categoriesMap["outros"] = {
              id: "outros",
              nome: "Outros",
              slug: "outros",
              profiles: [],
            };
          }
          categoriesMap["outros"].profiles.push(profile);
        }
      }
    });

    // Filtra apenas categorias com estabelecimentos
    const categoriesToShow = Object.values(categoriesMap).filter(
      (cat) => cat.profiles && cat.profiles.length > 0
    );

    return (
      <View className="gap-8 flex flex-co bg-white">
        {categoriesToShow.map((category) => (
          <View key={category.slug} className="mb-6">
            <Text className="text-xl font-semibold mb-4">{category.nome}</Text>

            <View className={`flex-row flex-wrap -mx-2`}>
              {category.profiles.map((profile) => (
                <View
                  key={profile.id}
                  style={{
                    width: `${100 / columnCount}%`,
                    paddingHorizontal: 8,
                    marginBottom: 16,
                  }}
                >
                  <DeliveryCard profile={profile} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Se não estiver agrupando, exibe em um grid simples
  return (
    <View className="flex-row flex-wrap -mx-2">
      {profiles.map((profile) => (
        <View
          key={profile.id}
          style={{
            width: `${100 / columnCount}%`,
            paddingHorizontal: 8,
            marginBottom: 16,
          }}
        >
          <DeliveryCard profile={profile} />
        </View>
      ))}
    </View>
  );
}
