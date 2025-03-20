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
  const itemHeight = itemWidth * (4 / 3);

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
    if (leaflet.pdf) {
      setSelectedLeaflet(leaflet);
      setViewerVisible(true);
      return;
    }

    const images = prepareLeafletImages(leaflet);
    if (images.length > 0) {
      setLeafletImages(images);
      setSelectedLeaflet(leaflet);
      setCurrentPage(0);
      setViewerVisible(true);
    }
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

  if (isLoading) {
    return (
      <View>
        <View className="mb-6">
          <View className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full">
            <HStack className="bg-secondary-100">
              <FileText size={20} color={THEME_COLORS.secondary} />
              <Text className="text-sm font-medium text-secondary-600">
                Encartes Promocionais
              </Text>
            </HStack>
          </View>

          <Text className="text-3xl font-semibold mb-2 text-secondary-600 text-center">
            Ofertas Imperdíveis
          </Text>

          <Text className="text-gray-600 mb-6 text-center">
            Confira os melhores preços e promoções dos estabelecimentos da sua
            região
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 py-2">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  marginRight: 16,
                }}
              >
                <Card className="w-full h-full animate-pulse bg-gray-200" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

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
      <View className="mb-6 px-4">
        <View className="inline-flex items-center mb-2">
          <HStack className="bg-secondary-100 gap-2 mb-4 px-4 py-2 rounded-full">
            <FileText size={20} color={THEME_COLORS.secondary} />
            <Text className="text-sm font-medium text-secondary-600">
              Encartes Promocionais
            </Text>
          </HStack>
        </View>

        <Text className="text-3xl font-semibold mb-2 text-secondary-600 text-center">
          Ofertas Imperdíveis
        </Text>

        <Text className="text-gray-600 font-sans text-center">
          Confira os melhores preços e promoções dos estabelecimentos da sua
          região
        </Text>
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
                <Card
                  className="w-full overflow-hidden border border-gray-200 rounded-xl"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
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

      <TouchableOpacity
        className="self-center mt-6 bg-secondary-500 px-6 py-4 rounded-full flex-row items-center font-bold"
        onPress={() => router.push("/(drawer)/(tabs)/encartes")}
        activeOpacity={0.8}
      >
        <Text className="text-white font-medium mr-2">
          Ver todos os encartes
        </Text>
        <ChevronRight size={16} color="white" />
      </TouchableOpacity>

      {/* Visualizador Modal */}
      {selectedLeaflet && viewerVisible && (
        <Modal
          visible={viewerVisible}
          transparent={false}
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleCloseViewer}
        >
          <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-black bg-opacity-80">
              <TouchableOpacity
                onPress={handleCloseViewer}
                className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
              >
                <X size={20} color="#FFF" />
              </TouchableOpacity>

              <View className="flex-1 ml-4">
                <Text
                  className="text-white font-semibold text-md"
                  numberOfLines={1}
                >
                  {selectedLeaflet.nome}
                </Text>
                <View className="flex-row items-center">
                  <Store size={12} color="#DDD" />
                  <Text className="text-gray-300 text-xs ml-1">
                    {typeof selectedLeaflet.empresa === "string"
                      ? selectedLeaflet.empresa
                      : selectedLeaflet.empresa?.nome ||
                        "Empresa não identificada"}
                  </Text>
                </View>
                <Text className="text-gray-300 text-xs">
                  Válido até {formatToBrazilianDate(selectedLeaflet.validade)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
                disabled={isSharing}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Share2 size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Visualizador */}
            <View className="flex-1">
              {selectedLeaflet.pdf ? (
                // Visualizador de PDF usando WebView
                <WebViewPdfViewer pdfUrl={selectedLeaflet.pdf} />
              ) : (
                // Visualizador de imagens
                <>
                  <ImageViewer
                    imageUrls={leafletImages}
                    index={currentPage}
                    onChange={(index?: number) => {
                      if (index !== undefined) {
                        setCurrentPage(index);
                      }
                    }}
                    backgroundColor="#000"
                    renderIndicator={(currentIndex: any, allSize) => (
                      <View className="absolute top-4 right-4 px-2 py-1 bg-black bg-opacity-70 rounded-full">
                        <Text className="text-white text-xs">
                          {currentIndex + 1}/{allSize}
                        </Text>
                      </View>
                    )}
                    loadingRender={() => (
                      <ActivityIndicator
                        size="large"
                        color={THEME_COLORS.secondary}
                      />
                    )}
                    enableSwipeDown
                    onSwipeDown={handleCloseViewer}
                    saveToLocalByLongPress={false}
                    pageAnimateTime={200}
                  />

                  {/* Miniaturas para navegação entre imagens */}
                  {leafletImages.length > 1 && (
                    <View className="h-20 bg-black">
                      <FlatList
                        data={leafletImages}
                        keyExtractor={(_, index) => `thumb_${index}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingHorizontal: 10,
                          paddingVertical: 8,
                        }}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            className={`mx-1 rounded-md overflow-hidden border-2 ${
                              currentPage === index
                                ? "border-secondary-500"
                                : "border-transparent"
                            }`}
                            style={{ width: 60, height: 60 }}
                            onPress={() => setCurrentPage(index)}
                          >
                            <ImagePreview
                              uri={item.url}
                              width="100%"
                              height="100%"
                              resizeMode="cover"
                            />
                            <View className="absolute bottom-0 right-0 bg-black bg-opacity-60 px-1">
                              <Text className="text-white text-xs">
                                {index + 1}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}
