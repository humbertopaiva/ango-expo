// Path: src/features/commerce/components/leaflet-carousel.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FileText, ChevronRight, X, Share2, Store } from "lucide-react-native";
import { Card, HStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Leaflet } from "../models/leaflet";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";
import { formatToBrazilianDate } from "@/src/utils/date.utils";
import { PdfViewerScreen } from "../../leaflets/screens/pdf-viewer-screen";

interface LeafletCarouselProps {
  leaflets: Leaflet[];
  isLoading: boolean;
}

// Estenda o modelo Leaflet para incluir o campo PDF
interface ExtendedLeaflet extends Leaflet {
  pdf?: string; // URL para o PDF do encarte
}

export function LeafletCarousel({ leaflets, isLoading }: LeafletCarouselProps) {
  // Estado para armazenar a largura da tela
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [selectedLeaflet, setSelectedLeaflet] =
    useState<ExtendedLeaflet | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [leafletImages, setLeafletImages] = useState<IImageInfo[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [viewerType, setViewerType] = useState<"image" | "pdf">("image");

  // Atualizar largura da tela quando houver mudanças
  useEffect(() => {
    const handleDimensionsChange = ({ window }: any) => {
      setScreenWidth(window.width);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );

    return () => subscription.remove();
  }, []);

  // Calcular a largura do item baseado na tela - TAMANHO REDUZIDO
  const calculateItemWidth = () => {
    if (screenWidth < 768) {
      return screenWidth * 0.65; // Reduzido de 0.75 para 0.65
    } else if (screenWidth < 1024) {
      return 240; // Reduzido de 280 para 240
    } else {
      return 280; // Reduzido de 320 para 280
    }
  };

  const itemWidth = calculateItemWidth();
  const itemHeight = itemWidth * (4 / 4);

  // Função para preparar as imagens do encarte
  const prepareLeafletImages = (leaflet: ExtendedLeaflet) => {
    const imageFields = [
      "imagem_01",
      "imagem_02",
      "imagem_03",
      "imagem_04",
      "imagem_05",
      "imagem_06",
      "imagem_07",
      "imagem_08",
      "imagem_09",
      "imagem_10",
    ];

    const images = imageFields
      .map((field) => {
        const imageUrl = leaflet[field as keyof Leaflet];
        if (typeof imageUrl === "string" && imageUrl) {
          return { url: imageUrl };
        }
        return null;
      })
      .filter((image): image is IImageInfo => image !== null);

    return images;
  };

  // Função para abrir o visualizador
  const handleOpenEncarte = (leaflet: ExtendedLeaflet) => {
    setSelectedLeaflet(leaflet);

    if (leaflet.pdf) {
      // For PDFs, we'll set viewerType to 'pdf'
      setViewerType("pdf");
    } else {
      // For images, use the existing image viewer
      const images = prepareLeafletImages(leaflet);
      if (images.length > 0) {
        setLeafletImages(images);
        setCurrentPage(0);
        setViewerType("image");
      }
    }

    setViewerVisible(true);
  };

  // Função para fechar o visualizador
  const handleCloseViewer = () => {
    setViewerVisible(false);
  };

  // Função para compartilhar
  const handleShare = async () => {
    if (!selectedLeaflet) return;

    try {
      setIsSharing(true);

      if (selectedLeaflet.pdf) {
        const fileName = `encarte_${selectedLeaflet.id}.pdf`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(selectedLeaflet.pdf, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: `Encarte: ${selectedLeaflet.nome}`,
          });
        }
      } else if (leafletImages.length > 0) {
        const currentImage = leafletImages[currentPage].url;
        const fileName = `encarte_${selectedLeaflet.id}_${currentPage}.jpg`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(currentImage, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Encarte: ${selectedLeaflet.nome}`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar encarte:", error);
    } finally {
      setIsSharing(false);
    }
  };

  if (leaflets.length === 0) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500 text-center">
          Nenhum encarte disponível no momento
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-4 px-4">
        <HStack className="justify-between items-center mb-2">
          <Text className="text-xl font-gothic mb-2 text-primary-500 ">
            ENCARTES
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(tabs)/encartes")}
            className="ml-auto"
          >
            <HStack className="gap-2" alignItems="center">
              <FileText
                size={16}
                color={THEME_COLORS.primary}
                style={{ marginLeft: 4, marginTop: 2 }}
              />

              <Text className="text-md font-semibold text-primary-500">
                Ver todos
              </Text>
            </HStack>
          </TouchableOpacity>
        </HStack>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row py-2 pb-4">
          {leaflets.map((leaflet, index) => {
            const extendedLeaflet = leaflet as ExtendedLeaflet;

            return (
              <TouchableOpacity
                key={leaflet.id}
                style={{
                  width: itemWidth,
                  marginRight: index < leaflets.length - 1 ? 16 : 0,
                }}
                onPress={() => handleOpenEncarte(extendedLeaflet)}
                activeOpacity={0.8}
              >
                <Card className="w-full overflow-hidden rounded-xl bg-white">
                  <View
                    style={{
                      width: itemWidth,
                      height: itemHeight,
                    }}
                    className="relative"
                  >
                    {leaflet.imagem_01 ? (
                      <ImagePreview
                        uri={leaflet.imagem_01}
                        width="100%"
                        height="100%"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center bg-gray-100">
                        <FileText size={48} color="#6B7280" />
                      </View>
                    )}

                    {/* Badge para PDF */}
                    {extendedLeaflet.pdf && (
                      <View className="absolute top-3 left-3 bg-red-500 rounded-full px-3 py-1">
                        <Text className="text-white text-xs font-medium">
                          PDF
                        </Text>
                      </View>
                    )}

                    <View className="absolute top-3 right-3 bg-secondary-500 rounded-full px-3 py-1">
                      <Text className="text-white text-xs font-medium">
                        Até {formatToBrazilianDate(leaflet.validade)}
                      </Text>
                    </View>
                  </View>
                  <View className="p-4">
                    <Text className="font-medium text-lg mb-1">
                      {leaflet.nome}
                    </Text>

                    {/* Empresa do Encarte - NOVO */}
                    <View className="flex-row items-center mb-2">
                      <Text className="text-sm text-gray-700 font-medium">
                        {typeof leaflet.empresa === "string"
                          ? leaflet.empresa
                          : leaflet.empresa?.nome || ""}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-xs text-gray-500">
                        Válido até {formatToBrazilianDate(leaflet.validade)}
                      </Text>
                      <View className="bg-secondary-100 rounded-full p-1">
                        <ChevronRight
                          size={16}
                          color={THEME_COLORS.secondary}
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Visualizador Modal */}
      {selectedLeaflet && viewerVisible && (
        <Modal
          visible={viewerVisible}
          transparent={false}
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleCloseViewer}
        >
          {viewerType === "pdf" ? (
            // PDF Viewer
            <PdfViewerScreen
              pdfUrl={selectedLeaflet.pdf || ""}
              title={selectedLeaflet.nome}
              companyName={
                typeof selectedLeaflet.empresa === "string"
                  ? selectedLeaflet.empresa
                  : selectedLeaflet.empresa?.nome || "Empresa"
              }
              validUntil={selectedLeaflet.validade}
              onClose={handleCloseViewer}
              onError={(error) => {
                console.error("Error viewing PDF:", error);
                handleCloseViewer();
              }}
            />
          ) : (
            // Image Viewer (original code)
            <SafeAreaView className="flex-1 bg-black">
              {/* Existing image viewer code */}
            </SafeAreaView>
          )}
        </Modal>
      )}
    </View>
  );
}
