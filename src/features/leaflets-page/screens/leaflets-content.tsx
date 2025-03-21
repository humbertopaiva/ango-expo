// Path: src/features/leaflets-page/screens/leaflets-content.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  StatusBar,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,
  Share,
} from "react-native";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { SearchInput } from "@/components/custom/search-input";
import {
  ShoppingBag,
  FileText,
  Sparkles,
  X,
  Share2,
  Store,
  ChevronRight,
} from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryFilterChips } from "../components/category-filter-chips";
import { CategoryLeafletsSection } from "../components/category-leaflets-section";
import { HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { PromotionalBanner } from "../../commerce/components/promotional-banner";
import { ImagePreview } from "@/components/custom/image-preview";
import { formatToBrazilianDate } from "@/src/utils/date.utils";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Interface estendida para suportar PDFs
interface ExtendedLeaflet extends Leaflet {
  pdf?: string;
}

export function LeafletsContent() {
  const vm = useLeafletsContext();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Estados para o visualizador
  const [selectedLeaflet, setSelectedLeaflet] =
    useState<ExtendedLeaflet | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [leafletImages, setLeafletImages] = useState<IImageInfo[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  const isMounted = useRef(true);

  // Limpeza na desmontagem do componente
  useEffect(() => {
    isMounted.current = true;

    // Adicionar handler para o botão voltar no Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (viewerVisible) {
          handleCloseViewer();
          return true;
        }
        return false;
      }
    );

    return () => {
      isMounted.current = false;
      backHandler.remove();
    };
  }, []);

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

  // Manipulador para abrir o visualizador de encartes
  const handleOpenLeaflet = (leaflet: Leaflet) => {
    const extendedLeaflet = leaflet as ExtendedLeaflet;

    if (extendedLeaflet.pdf) {
      // Se for PDF, não precisamos preparar imagens
      setLeafletImages([]);
    } else {
      // Prepara as imagens para o visualizador
      const images = prepareLeafletImages(extendedLeaflet);
      setLeafletImages(images);
    }

    setSelectedLeaflet(extendedLeaflet);
    setCurrentPage(0);
    setViewerVisible(true);
  };

  // Manipulador para fechar o visualizador
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

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["leaflets"] });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Promocional */}
        <View className="px-4 pt-4">
          <PromotionalBanner />
        </View>

        {/* Cabeçalho */}
        <View className="items-center mb-6 pt-6 px-4">
          <HStack className="bg-primary-100/60 px-4 py-2 rounded-full items-center gap-2 mb-4">
            <Sparkles size={18} color={THEME_COLORS.primary} />
            <Text className="text-sm font-medium text-primary-500">
              Promoções e Ofertas
            </Text>
          </HStack>

          <VStack alignItems="center" space="xs">
            <Text className="text-3xl font-gothic text-secondary-500 text-center mb-1">
              ENCARTES <Text className="text-primary-500">PROMOCIONAIS</Text>
            </Text>
            <Text className="text-gray-600 text-center font-sans">
              Confira os melhores preços e ofertas das lojas da sua região
            </Text>
          </VStack>
        </View>

        {/* Barra de busca */}
        <View className="px-4 mb-6">
          <SearchInput
            value={vm.searchTerm}
            onChangeText={vm.setSearchTerm}
            placeholder="Buscar encartes..."
            disabled={vm.isLoading}
          />
        </View>

        {/* Filtros de Categorias */}
        <CategoryFilterChips
          categories={vm.categories}
          activeCategories={vm.activeCategories}
          toggleCategory={vm.toggleCategoryFilter}
          selectAll={vm.selectAllCategories}
          allCategoriesSelected={vm.allCategoriesSelected}
          isLoading={vm.isLoading}
        />

        {/* Conteúdo principal: encartes por categoria */}
        <View className="mt-6">
          {vm.isLoading ? (
            <View className="space-y-8 px-4">
              {[1, 2].map((i) => (
                <View key={i} className="space-y-4">
                  <View className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
                  <View className="flex-row space-x-4">
                    <View className="h-48 w-40 bg-gray-200 rounded-lg animate-pulse" />
                    <View className="h-48 w-40 bg-gray-200 rounded-lg animate-pulse" />
                  </View>
                </View>
              ))}
            </View>
          ) : vm.categorizedLeaflets.length === 0 ? (
            <View className="items-center justify-center py-16">
              <ShoppingBag size={48} color="#9CA3AF" />
              <Text className="text-lg font-medium mt-4 mb-2">
                Nenhum encarte encontrado
              </Text>
              <Text className="text-gray-500 text-center max-w-xs">
                Não encontramos encartes ativos com os filtros selecionados.
                Tente remover os filtros ou tente novamente mais tarde.
              </Text>
            </View>
          ) : (
            <View>
              {vm.categorizedLeaflets.map((category) => (
                <CategoryLeafletsSection
                  key={category.id}
                  categoryName={category.name}
                  categorySlug={category.slug}
                  leaflets={category.leaflets}
                  onLeafletPress={handleOpenLeaflet}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Visualizador Modal - EXATAMENTE IGUAL AO LEAFLET CAROUSEL */}
      {selectedLeaflet && viewerVisible && (
        <Modal
          visible={viewerVisible}
          transparent={false}
          animationType="fade"
          statusBarTranslucent
          onRequestClose={handleCloseViewer}
        >
          <StatusBar backgroundColor="black" barStyle="light-content" />
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
    </SafeAreaView>
  );
}
