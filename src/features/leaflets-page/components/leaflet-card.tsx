// Path: src/features/leaflets-page/components/leaflet-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Leaflet } from "../models/leaflet";
import { Calendar, FileText, ChevronRight, Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { ResilientImage } from "@/components/common/resilient-image";

interface LeafletCardProps {
  leaflet: Leaflet;
  onPress?: () => void;
}

export function LeafletCard({ leaflet, onPress }: LeafletCardProps) {
  const isActive = isAfter(new Date(leaflet.validade), new Date());

  // Formatação da data em formato legível (ex: "12 de maio")
  const formattedDate = format(new Date(leaflet.validade), "dd 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <TouchableOpacity onPress={onPress} className="w-full h-full">
      <View className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        {/* Imagem principal (primeira página do encarte) */}
        <View style={{ width: "100%", height: "70%" }} className="relative">
          {leaflet.imagem_01 ? (
            <ImagePreview
              uri={leaflet.imagem_01}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <FileText size={48} color="#9CA3AF" />
            </View>
          )}

          {/* Badge de validade */}
          <View className="absolute top-3 right-3 bg-secondary-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-medium">
              Até {formattedDate}
            </Text>
          </View>
        </View>

        {/* Conteúdo */}
        <View className="p-4 flex-1">
          <Text className="font-medium text-lg mb-1">{leaflet.nome}</Text>

          {/* Nome da empresa */}
          <View className="flex-row items-center mb-2">
            <Text className="text-sm text-primary-500 font-medium">
              {leaflet.empresa.nome}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-gray-500">
              Válido até {formattedDate}
            </Text>
            <View className="bg-secondary-50 rounded-full px-2 py-1">
              <ChevronRight size={16} color={THEME_COLORS.secondary} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
