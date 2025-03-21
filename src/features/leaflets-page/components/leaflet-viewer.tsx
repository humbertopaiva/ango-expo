// Path: src/features/leaflets-page/components/leaflet-viewer.tsx
import React, { useState } from "react";
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
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Store,
} from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { ImagePreview } from "@/components/custom/image-preview";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";
import { THEME_COLORS } from "@/src/styles/colors";
import { formatToBrazilianDate } from "@/src/utils/date.utils";

interface LeafletViewerProps {
  leaflet: Leaflet;
  visible: boolean;
  onClose: () => void;
}

export function LeafletViewer({
  leaflet,
  visible,
  onClose,
}: LeafletViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  // Coleta todas as imagens não nulas do encarte
  const images = [
    leaflet.imagem_01,
    leaflet.imagem_02,
    leaflet.imagem_03,
    leaflet.imagem_04,
    leaflet.imagem_05,
    leaflet.imagem_06,
    leaflet.imagem_07,
    leaflet.imagem_08,
  ].filter((img): img is string => !!img);

  // Formatar imagens para o ImageViewer
  const leafletImages = images.map((url) => ({ url }));

  const handleShare = async () => {
    if (images.length === 0) return;

    try {
      setIsSharing(true);
      const imageUrl = images[currentPage];

      const result = await Share.share({
        title: leaflet.nome,
        message: `Confira o encarte "${leaflet.nome}" de ${leaflet.empresa.nome}`,
        url: imageUrl,
      });
    } catch (error) {
      Alert.alert(
        "Erro ao compartilhar",
        "Não foi possível compartilhar este encarte."
      );
      console.error("Erro ao compartilhar:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    if (images.length === 0) return;

    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = images[currentPage];
      link.download = `${leaflet.nome}-pagina-${currentPage + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Alert.alert(
        "Download não disponível",
        "O download de imagens está disponível apenas na versão web."
      );
    }
  };

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

        {/* Visualizador de imagens */}
        <View className="flex-1">
          {images.length > 0 ? (
            <>
              <ImageViewer
                imageUrls={leafletImages}
                index={currentPage}
                onChange={(index) => setCurrentPage(index)}
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
              />

              {/* Miniaturas para navegação entre imagens */}
              {images.length > 1 && (
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
