// Path: src/features/leaflets-page/components/leaflet-viewer.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SafeAreaView as RNSafeAreaView,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Store,
  FileText,
} from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { ResilientImage } from "@/components/common/resilient-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { THEME_COLORS } from "@/src/styles/colors";
import { formatToBrazilianDate } from "@/src/utils/date.utils";
import { HStack, VStack } from "@gluestack-ui/themed";

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
  const insets = useSafeAreaInsets();
  const [isSharing, setIsSharing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [leafletImages, setLeafletImages] = useState<IImageInfo[]>([]);
  const { width, height } = Dimensions.get("window");

  // Preparar as imagens ou o PDF assim que o componente montar
  useEffect(() => {
    if (visible && leaflet) {
      prepareContent();
    }
  }, [visible, leaflet]);

  // Função para preparar o conteúdo do encarte (imagens ou PDF)
  const prepareContent = () => {
    if (leaflet.pdf) {
      // Se for PDF, não precisamos preparar imagens
      return;
    }

    // Se não for PDF, prepara as imagens
    const images = prepareLeafletImages(leaflet);
    setLeafletImages(images);
    setCurrentPage(0);
  };

  // Função para preparar as imagens do encarte
  const prepareLeafletImages = (leaflet: Leaflet) => {
    const imageFields = [
      "imagem_01",
      "imagem_02",
      "imagem_03",
      "imagem_04",
      "imagem_05",
      "imagem_06",
      "imagem_07",
      "imagem_08",
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

  // Função para compartilhar
  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (leaflet.pdf) {
        const fileName = `encarte_${leaflet.id}.pdf`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(leaflet.pdf, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: `Encarte: ${leaflet.nome}`,
          });
        }
      } else if (leafletImages.length > 0) {
        const currentImage = leafletImages[currentPage].url;
        const fileName = `encarte_${leaflet.id}_${currentPage}.jpg`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(currentImage, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Encarte: ${leaflet.nome}`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar encarte:", error);
      Alert.alert(
        "Erro ao compartilhar",
        "Não foi possível compartilhar este conteúdo."
      );
    } finally {
      setIsSharing(false);
    }
  };

  // Função para download (apenas na web)
  const handleDownload = () => {
    if (Platform.OS === "web") {
      if (leaflet.pdf) {
        const link = document.createElement("a");
        link.href = leaflet.pdf;
        link.download = `${leaflet.nome}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (leafletImages.length > 0) {
        const link = document.createElement("a");
        link.href = leafletImages[currentPage].url;
        link.download = `${leaflet.nome}-pagina-${currentPage + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      Alert.alert(
        "Download não disponível",
        "O download está disponível apenas na versão web."
      );
    }
  };

  // Renderiza o cabeçalho do visualizador
  const renderHeader = () => (
    <View className="flex-row items-center justify-between p-4 bg-black bg-opacity-90">
      <TouchableOpacity
        onPress={onClose}
        className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
      >
        <X size={20} color="#FFF" />
      </TouchableOpacity>

      <View className="flex-1 ml-4">
        <Text className="text-white font-semibold text-md" numberOfLines={1}>
          {leaflet.nome}
        </Text>
        <HStack alignItems="center" space="xs">
          <Store size={12} color="#DDD" />
          <Text className="text-gray-300 text-xs">
            {typeof leaflet.empresa === "string"
              ? leaflet.empresa
              : leaflet.empresa?.nome || "Empresa não identificada"}
          </Text>
        </HStack>
        <Text className="text-gray-300 text-xs">
          Válido até {formatToBrazilianDate(leaflet.validade)}
        </Text>
      </View>

      <HStack space="md">
        <TouchableOpacity
          onPress={handleDownload}
          className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
        >
          <Download size={20} color="#FFF" />
        </TouchableOpacity>

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
      </HStack>
    </View>
  );

  // Renderiza o rodapé (apenas para visualização de imagens)
  const renderFooter = () => {
    if (leaflet.pdf || leafletImages.length <= 1) return null;

    return (
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
              <ResilientImage
                source={item.url}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                fallbackSource={<FileText size={20} color="#6B7280" />}
              />
              <View className="absolute bottom-0 right-0 bg-black bg-opacity-60 px-1">
                <Text className="text-white text-xs">{index + 1}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Renderiza o conteúdo principal (PDF ou galeria de imagens)
  const renderContent = () => {
    if (leaflet.pdf) {
      return (
        <WebViewPdfViewer
          pdfUrl={leaflet.pdf}
          onError={(error) => console.error("Erro ao carregar PDF:", error)}
        />
      );
    }

    if (leafletImages.length === 0) {
      return (
        <View className="flex-1 items-center justify-center bg-black">
          <FileText size={48} color="#6B7280" />
          <Text className="text-white mt-4">
            Não há imagens disponíveis para este encarte.
          </Text>
        </View>
      );
    }

    return (
      <ImageViewer
        imageUrls={leafletImages}
        index={currentPage}
        onChange={(index) => {
          if (index !== undefined) {
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
          <ActivityIndicator size="large" color={THEME_COLORS.secondary} />
        )}
        enableSwipeDown
        onSwipeDown={onClose}
        saveToLocalByLongPress={false}
        pageAnimateTime={200}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <RNSafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000",
          paddingTop: insets.top,
          paddingBottom: leaflet.pdf ? 0 : insets.bottom,
        }}
      >
        {renderHeader()}

        <View className="flex-1">{renderContent()}</View>

        {renderFooter()}
      </RNSafeAreaView>
    </Modal>
  );
}
