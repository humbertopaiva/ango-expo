// Path: src/features/company-page/components/company-gallery.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react-native";
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

  // Animações para indicadores de paginação
  const scrollX = useRef(new Animated.Value(0)).current;

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

  // Tamanho de cada imagem na galeria (3 por linha)
  const imageSize = (width - 48) / 3;

  // Abrir visualizador de carrossel
  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setCarouselVisible(true);
  };

  // Fechar visualizador de carrossel
  const handleCloseCarousel = () => {
    setCarouselVisible(false);
  };

  // Ir para imagem anterior
  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  // Ir para próxima imagem
  const handleNextImage = () => {
    if (currentIndex < galleryImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View>
      <View className="px-4">
        <View className="flex-row items-center justify-between mb-3">
          <HStack className="flex-row items-center">
            <Camera
              size={24}
              color={vm.primaryColor || "#F4511E"}
              className="mr-2"
            />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Galeria de Imagens
            </Text>
          </HStack>

          {galleryImages.length > 3 && (
            <TouchableOpacity
              onPress={() => handleImagePress(0)}
              className="py-1 px-3 rounded-full"
              style={{ backgroundColor: `${vm.primaryColor || "#F4511E"}15` }}
            >
              <Text
                style={{ color: vm.primaryColor || "#F4511E" }}
                className="text-xs font-medium"
              >
                Ver todas
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grade de miniaturas de imagens */}
      <View className="px-4">
        <View className="flex-row flex-wrap -mx-1">
          {galleryImages.slice(0, 6).map((image, index) => (
            <TouchableOpacity
              key={image.id}
              className="p-1"
              style={{ width: imageSize + 2 }}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <View
                className="rounded-lg overflow-hidden"
                style={{ height: imageSize }}
              >
                <ImagePreview
                  uri={image.url}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                  containerClassName="bg-gray-100"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
