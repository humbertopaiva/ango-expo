// src/features/leaflets/components/leaflet-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Leaflet } from "../models/leaflet";
import { Calendar, Store, Eye } from "lucide-react-native";
import { ResilientImage } from "@/components/common/resilient-image";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeafletCardProps {
  leaflet: Leaflet;
  onPress?: () => void;
}

export function LeafletCard({ leaflet, onPress }: LeafletCardProps) {
  const isActive = isAfter(new Date(leaflet.validade), new Date());

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg overflow-hidden bg-white shadow mb-4"
      activeOpacity={0.8}
    >
      {/* Banner com overlay gradiente */}
      <View className="relative h-56">
        {leaflet.banner ? (
          <>
            <View className="absolute inset-0 bg-black/30 z-10" />
            <ResilientImage
              source={leaflet.banner}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              fallbackSource={<Store size={64} color="#9CA3AF" />}
            />
          </>
        ) : (
          <View className="w-full h-full bg-gray-100 items-center justify-center">
            <Store size={64} color="#9CA3AF" />
          </View>
        )}

        {/* Badge de status */}
        <View
          className={`absolute top-4 right-4 z-20 px-2 py-1 rounded-full ${
            isActive ? "bg-primary-500" : "bg-gray-500"
          }`}
        >
          <Text className="text-white text-xs font-medium">
            {isActive ? "Ativo" : "Encerrado"}
          </Text>
        </View>

        {/* Empresa Logo & Nome */}
        <View className="absolute bottom-4 left-4 right-4 z-20 flex-row items-center bg-white/90 p-3 rounded-lg">
          <View className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 mr-3">
            <ResilientImage
              source={leaflet.empresa.logo}
              style={{ width: 32, height: 32 }}
              fallbackSource={
                <Text className="text-center text-gray-500 font-semibold">
                  {leaflet.empresa.nome.substring(0, 2).toUpperCase()}
                </Text>
              }
            />
          </View>
          <Text className="font-medium text-sm flex-1" numberOfLines={1}>
            {leaflet.empresa.nome}
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="p-4">
        {/* Nome do encarte */}
        <Text className="text-lg font-bold mb-3" numberOfLines={2}>
          {leaflet.nome}
        </Text>

        {/* Data de validade */}
        <View className="flex-row items-center">
          <Calendar size={16} color="#6B7280" />
          <Text className="ml-2 text-sm text-gray-600">
            Válido até{" "}
            {format(new Date(leaflet.validade), "dd 'de' MMMM", {
              locale: ptBR,
            })}
          </Text>
        </View>

        {/* Indicador de visualização */}
        <View className="mt-3 flex-row items-center justify-end">
          <Eye size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600">Visualizar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
