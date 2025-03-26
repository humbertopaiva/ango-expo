// Path: src/features/company-page/components/company-gallery.tsx
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  StyleSheet,
} from "react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Camera, ChevronRight } from "lucide-react-native";
import { GalleryImageViewer } from "./gallery-image-viewer";
import { HStack } from "@gluestack-ui/themed";

interface GalleryImage {
  url: string;
  id: string;
}

export function CompanyGallery() {
  const vm = useCompanyPageContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselVisible, setCarouselVisible] = useState(false);
  const { width } = Dimensions.get("window");
  const flatListRef = useRef<FlatList>(null);

  // Cor primária da empresa ou valor padrão
  const primaryColor = vm.primaryColor || "#F4511E";

  // Função para extrair todas as imagens válidas do perfil
  const galleryImages = useMemo(() => {
    if (!vm.profile) return [];

    const images: GalleryImage[] = [];

    // Adicionar as imagens 01-06 se existirem
    for (let i = 1; i <= 6; i++) {
      const key = `imagem_0${i}` as keyof typeof vm.profile;
      const imageUrl = vm.profile[key] as string | null;

      if (imageUrl) {
        images.push({
          url: imageUrl,
          id: `gallery-${i}`,
        });
      }
    }

    return images;
  }, [vm.profile]);

  // Se não houver imagens, não renderiza nada
  if (galleryImages.length === 0) {
    return null;
  }

  // Tamanho de cada imagem na galeria horizontal
  const imageWidth = width * 0.65; // Reduzindo para 65% da largura da tela
  const imageHeight = imageWidth * 0.75; // Proporção 4:3

  // Abrir visualizador de carrossel
  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setCarouselVisible(true);
  };

  // Fechar visualizador de carrossel
  const handleCloseCarousel = () => {
    setCarouselVisible(false);
  };

  // Renderizar cada item da galeria horizontal
  const renderGalleryItem = ({
    item,
    index,
  }: {
    item: GalleryImage;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleImagePress(index)}
        activeOpacity={0.9}
        style={styles.galleryItem}
      >
        <View
          style={[
            styles.imageContainer,
            { width: imageWidth, height: imageHeight },
          ]}
        >
          <ImagePreview
            uri={item.url}
            width="100%"
            height="100%"
            resizeMode="cover"
            containerClassName="rounded-lg overflow-hidden"
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Função para renderizar o indicador de paginação
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {galleryImages.map((_, idx) => (
          <View
            key={`dot-${idx}`}
            style={[
              styles.paginationDot,
              idx === currentIndex && {
                width: 24,
                backgroundColor: primaryColor,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Ver todas as imagens
  const handleViewAll = () => {
    handleImagePress(0);
  };

  // Personalizar o formato de exibição do indicador
  const renderCustomPaginationIndicator = () => {
    return (
      <View style={styles.paginationIndicator}>
        <Text style={styles.paginationText}>
          {currentIndex + 1}/{galleryImages.length}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho da galeria */}
      <View className="px-4 mb-4">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Camera size={24} color={primaryColor} />
            <Text className="text-md font-semibold text-gray-800 ml-2">
              Galeria
            </Text>
          </HStack>
        </HStack>
      </View>

      {/* Galeria horizontal */}
      <View>
        <FlatList
          ref={flatListRef}
          data={galleryImages}
          keyExtractor={(item) => item.id}
          renderItem={renderGalleryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={imageWidth + 8} // Largura da imagem + padding
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onScroll={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(offsetX / (imageWidth + 8));
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
            }
          }}
          scrollEventThrottle={16}
        />

        {/* Indicadores de paginação */}
        {galleryImages.length > 1 && renderPaginationDots()}
      </View>

      {/* Visualizador de carrossel em tela cheia */}
      <GalleryImageViewer
        isVisible={isCarouselVisible}
        images={galleryImages.map((img) => img.url)}
        initialIndex={currentIndex}
        onClose={handleCloseCarousel}
        title={`Fotos de ${vm.profile?.nome || "Empresa"}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12, // Reduzindo o espaçamento vertical
  },
  listContent: {
    paddingHorizontal: 16,
  },
  galleryItem: {
    marginRight: 8,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  paginationIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
