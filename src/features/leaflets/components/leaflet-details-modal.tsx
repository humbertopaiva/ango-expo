// Path: src/features/leaflets/components/leaflet-details-modal.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Leaflet } from "../models/leaflet";
import { X, Calendar, FileText, Eye } from "lucide-react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button, ButtonText } from "@/components/ui/button";
import { ImagePreview } from "@/components/custom/image-preview";
import { StatusBadge } from "@/components/custom/status-badge";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";

interface LeafletDetailsModalProps {
  leaflet: Leaflet | null;
  isVisible: boolean;
  onClose: () => void;
}

export function LeafletDetailsModal({
  leaflet,
  isVisible,
  onClose,
}: LeafletDetailsModalProps) {
  if (!leaflet) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const images = [
    leaflet.imagem_01,
    leaflet.imagem_02,
    leaflet.imagem_03,
    leaflet.imagem_04,
    leaflet.imagem_05,
    leaflet.imagem_06,
    leaflet.imagem_07,
    leaflet.imagem_08,
  ].filter(Boolean) as string[];

  const hasPdf = !!leaflet.pdf;
  const hasImages = images.length > 0;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="flex-1 mt-6 bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">Detalhes do Encarte</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            {/* Cabeçalho com Banner e Info Básica */}
            <View className="p-4 flex-row gap-4">
              <View className="w-24 h-24 rounded-lg overflow-hidden">
                <ImagePreview
                  uri={leaflet.banner}
                  fallbackIcon={FileText}
                  fallbackText="Sem banner"
                  width={96}
                  height={96}
                />
              </View>

              <View className="flex-1">
                <Text className="text-xl font-semibold mb-1">
                  {leaflet.nome}
                </Text>

                <View className="flex-row mt-1 gap-2">
                  <StatusBadge
                    status={leaflet.status}
                    customLabel={
                      leaflet.status === "ativo" ? "Ativo" : "Inativo"
                    }
                  />

                  {hasPdf ? (
                    <View className="px-2 py-1 rounded-full bg-blue-100">
                      <Text className="text-blue-800 text-xs">PDF</Text>
                    </View>
                  ) : (
                    <View className="px-2 py-1 rounded-full bg-gray-100">
                      <Text className="text-gray-800 text-xs">
                        {images.length}{" "}
                        {images.length === 1 ? "página" : "páginas"}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center mt-2">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-500 ml-1">
                    Válido até: {formatDate(leaflet.validade)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Conteúdo do encarte (PDF ou Imagens) */}
            {hasPdf ? (
              <View className="p-4 border-t border-gray-100">
                <View className="flex-row items-center mb-4">
                  <FileText size={20} color="#3B82F6" />
                  <Text className="text-lg font-semibold ml-2">
                    Encarte em PDF
                  </Text>
                </View>

                <View className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                  {Platform.OS === "web" ? (
                    <iframe
                      src={leaflet.pdf as string}
                      className="w-full h-full"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <WebViewPdfViewer
                      pdfUrl={leaflet.pdf as string}
                      onError={(error) =>
                        console.error("Error loading PDF", error)
                      }
                    />
                  )}
                </View>
              </View>
            ) : hasImages ? (
              <View className="p-4 border-t border-gray-100">
                <Text className="text-lg font-semibold mb-4">
                  Páginas do Encarte
                </Text>
                <View className="flex-row flex-wrap">
                  {images.map((image, index) => (
                    <View key={index} className="w-1/2 p-1 aspect-[3/4]">
                      <TouchableOpacity
                        className="w-full h-full rounded-lg overflow-hidden"
                        activeOpacity={0.8}
                      >
                        <ImagePreview
                          uri={image}
                          fallbackIcon={FileText}
                          width="100%"
                          height="100%"
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                          <Eye size={18} color="#0891B2" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View className="p-4 border-t border-gray-100 items-center">
                <FileText size={32} color="#D1D5DB" className="mb-2" />
                <Text className="text-gray-500 text-center">
                  Este encarte não possui páginas ou PDF.
                </Text>
              </View>
            )}

            {/* Metadados */}
            <View className="p-4 border-t border-gray-200">
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-500 ml-1">
                    Criado em: {formatDate(leaflet.date_created)}
                  </Text>
                </View>
                {leaflet.date_updated && (
                  <View className="flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-1">
                      Atualizado em: {formatDate(leaflet.date_updated)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer com botão de fechar */}
          <View className="p-4 border-t border-gray-200">
            <Button onPress={onClose} variant="outline" className="w-full">
              <ButtonText>Fechar</ButtonText>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
