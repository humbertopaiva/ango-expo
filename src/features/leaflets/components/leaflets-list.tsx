// src/features/leaflets/components/leaflets-list.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoreHorizontal, FileText } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeafletsListProps {
  leaflets: Leaflet[];
  isLoading: boolean;
  onEdit: (leaflet: Leaflet) => void;
  onDelete: (leaflet: Leaflet) => void;
  onView: (leaflet: Leaflet) => void;
}

export function LeafletsList({
  leaflets,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: LeafletsListProps) {
  if (isLoading) {
    return (
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  if (leaflets.length === 0) {
    return (
      <View className="p-6 bg-white rounded-lg">
        <Text className="text-gray-500 text-center">
          Nenhum encarte encontrado. Crie um novo encarte para começar.
        </Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Count the number of pages in a leaflet
  const countPages = (leaflet: Leaflet) => {
    return [
      leaflet.imagem_01,
      leaflet.imagem_02,
      leaflet.imagem_03,
      leaflet.imagem_04,
      leaflet.imagem_05,
      leaflet.imagem_06,
      leaflet.imagem_07,
      leaflet.imagem_08,
    ].filter(Boolean).length;
  };

  return (
    <View className="space-y-4">
      {leaflets.map((leaflet) => (
        <Card key={leaflet.id} className="p-4 bg-white">
          <View className="flex-row items-center space-x-4">
            {/* Imagem ou ícone do encarte */}
            <View className="h-16 w-16 bg-gray-100 rounded-lg items-center justify-center">
              {leaflet.banner ? (
                <Image
                  source={{ uri: leaflet.banner }}
                  style={{ height: "100%", width: "100%", borderRadius: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <FileText size={24} color="#6B7280" />
              )}
            </View>

            {/* Informações do encarte */}
            <View className="flex-1">
              <Text className="font-medium text-base">{leaflet.nome}</Text>
              <Text className="text-sm text-gray-500">
                Válido até: {formatDate(leaflet.validade)}
              </Text>
              <View className="flex-row items-center mt-2 space-x-2">
                <View
                  className={`px-2 py-1 rounded-full ${
                    leaflet.status === "ativo" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      leaflet.status === "ativo"
                        ? "text-green-800"
                        : "text-gray-800"
                    }
                  >
                    {leaflet.status === "ativo" ? "Ativo" : "Inativo"}
                  </Text>
                </View>
                <View className="px-2 py-1 rounded-full bg-gray-100">
                  <Text className="text-gray-800">
                    {countPages(leaflet)}{" "}
                    {countPages(leaflet) === 1 ? "página" : "páginas"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu de ações */}
            <TouchableOpacity
              onPress={() => {
                // Mostrar menu de ações (usar Dropdown no web e ActionSheet no mobile)
                onEdit(leaflet);
              }}
              className="p-2"
            >
              <MoreHorizontal size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </View>
  );
}
