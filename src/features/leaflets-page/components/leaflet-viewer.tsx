// Path: src/features/leaflets-page/components/leaflet-viewer.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  StatusBar,
  ActivityIndicator,
  FlatList,
  BackHandler,
} from "react-native";
import { X, Share2, Store, FileText } from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { ImagePreview } from "@/components/custom/image-preview";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";
import { THEME_COLORS } from "@/src/styles/colors";
import { formatToBrazilianDate } from "@/src/utils/date.utils";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

interface LeafletViewerProps {
  leaflet: Leaflet;
  visible: boolean;
  onClose: () => void;
}

// Interface estendida similar ao que foi usado no LeafletCarousel
interface ExtendedLeaflet extends Leaflet {
  pdf?: string; // URL para o PDF do encarte
}

export function LeafletViewer({
  leaflet,
  visible,
  onClose,
}: LeafletViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [leafletImages, setLeafletImages] = useState<IImageInfo[]>([]);
  const isMounted = useRef(true);

  // Preparar as imagens quando o leaflet muda
  useEffect(() => {
    isMounted.current = true;

    if (leaflet) {
      // Preparar as imagens do encarte
      const images = prepareLeafletImages(leaflet as ExtendedLeaflet);
      setLeafletImages(images);
      setCurrentPage(0);
    }

    // Adicionar handler para o botão voltar no Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose();
          return true;
        }
        return false;
      }
    );

    return () => {
      isMounted.current = false;
      backHandler.remove();
    };
  }, [leaflet.id, visible]);

  // Função para preparar as imagens do encarte - copiada da implementação funcional
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

  // Função para compartilhar - similar à do LeafletCarousel
  const handleShare = async () => {
    if (!visible) return;

    try {
      setIsSharing(true);
      const extendedLeaflet = leaflet as ExtendedLeaflet;

      if (extendedLeaflet.pdf) {
        const fileName = `encarte_${extendedLeaflet.id}.pdf`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(extendedLeaflet.pdf, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: `Encarte: ${extendedLeaflet.nome}`,
          });
        }
      } else if (leafletImages.length > 0) {
        const currentImage = leafletImages[currentPage].url;
        const fileName = `encarte_${extendedLeaflet.id}_${currentPage}.jpg`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(currentImage, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Encarte: ${extendedLeaflet.nome}`,
          });
        }
      }
    } catch (error) {
      if (isMounted.current) {
        Alert.alert(
          "Erro ao compartilhar",
          "Não foi possível compartilhar este encarte."
        );
        console.error("Erro ao compartilhar:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsSharing(false);
      }
    }
  };

  // Detectar se é um PDF
  const extendedLeaflet = leaflet as ExtendedLeaflet;
  const isPdf = !!extendedLeaflet.pdf;

  // Retorna null se não estiver visível para desmontar completamente
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-black">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-black bg-opacity-80">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
          >
            <X size={20} color="#FFF" />
          </TouchableOpacity>

          <View className="flex-1 ml-4">
            <Text
              className="text-white font-semibold text-md"
              numberOfLines={1}
            >
              {leaflet.nome}
            </Text>
            <View className="flex-row items-center">
              <Store size={12} color="#DDD" />
              <Text className="text-gray-300 text-xs ml-1">
                {typeof leaflet.empresa === "string"
                  ? leaflet.empresa
                  : leaflet.empresa?.nome || "Empresa não identificada"}
              </Text>
            </View>
            <Text className="text-gray-300 text-xs">
              Válido até {formatToBrazilianDate(leaflet.validade)}
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

        {/* Conteúdo do visualizador */}
        <View className="flex-1">
          {isPdf ? (
            // Visualizador de PDF
            <WebViewPdfViewer pdfUrl={extendedLeaflet.pdf || ""} />
          ) : leafletImages.length > 0 ? (
            // Visualizador de imagens
            <>
              <ImageViewer
                imageUrls={leafletImages}
                index={currentPage}
                onChange={(index) => {
                  if (index !== undefined && isMounted.current) {
                    setCurrentPage(index);
                  }
                }}
                backgroundColor="#000"
                renderIndicator={(currentIndex, allSize) => (
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
                onSwipeDown={onClose}
                saveToLocalByLongPress={false}
                pageAnimateTime={200}
                menus={() => <></>} // Desativar o menu de contexto de longo press
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
          ) : (
            // Fallback quando não há imagens
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-center">
                Não há imagens disponíveis para este encarte.
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
