// Path: src/features/company-page/components/gallery-image-viewer.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  StatusBar,
  Share,
  FlatList,
} from "react-native";
import { X, Share2, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { Package } from "lucide-react-native";
import {
  PinchGestureHandler,
  State,
  PanGestureHandler,
} from "react-native-gesture-handler";

interface GalleryImageViewerProps {
  isVisible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
  title?: string;
}

export function GalleryImageViewer({
  isVisible,
  images,
  initialIndex,
  onClose,
  title,
}: GalleryImageViewerProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Configuração de animação para zoom
  const scale = useRef(new Animated.Value(1)).current;

  // Manipulador de gestos de pinça (zoom)
  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  });

  // Reiniciar zoom quando terminar o gesto
  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 2,
      }).start();
    }
  };

  // Ir para imagem anterior
  const handlePrevImage = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  // Ir para próxima imagem
  const handleNextImage = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
    }
  };

  // Handler para evento de scroll
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Handler para final do scroll
  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  // Função para compartilhar imagem atual
  const handleShare = async () => {
    const currentImageUrl = images[currentIndex];
    if (!currentImageUrl) return;

    try {
      await Share.share({
        message: title
          ? `${title} - Imagem ${currentIndex + 1} de ${images.length}`
          : `Imagem ${currentIndex + 1} de ${images.length}`,
        url: currentImageUrl, // Apenas para iOS
      });
    } catch (error) {
      console.error("Erro ao compartilhar imagem:", error);
    }
  };

  // Renderizar cada item do carrossel
  const renderItem = ({ item }: { item: string }) => {
    return (
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.imageContainer,
            {
              width,
              transform: [{ scale }],
            },
          ]}
        >
          <ImagePreview
            uri={item}
            width="100%"
            height="100%"
            resizeMode="contain"
            fallbackIcon={Package}
            containerClassName="bg-transparent"
          />
        </Animated.View>
      </PinchGestureHandler>
    );
  };

  // Renderizar indicadores de paginação
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Mostrar controles de navegação (setas)
  const renderNavigationControls = () => {
    if (images.length <= 1) return null;

    return (
      <View style={styles.navigationControls}>
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevImage}
            activeOpacity={0.7}
          >
            <ChevronLeft size={28} color="white" />
          </TouchableOpacity>
        )}
        {currentIndex < images.length - 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextImage}
            activeOpacity={0.7}
          >
            <ChevronRight size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Contador de imagens atual/total
  const renderCounter = () => {
    return (
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1}/{images.length}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.9)"
        barStyle="light-content"
      />

      <View style={styles.modalContainer}>
        {/* Botões de controle no topo */}
        <View style={[styles.headerControls, { marginTop: insets.top || 20 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {title && (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          )}

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Carrossel de imagens */}
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, index) => `image-${index}`}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        {/* Indicadores de paginação */}
        {renderPagination()}

        {/* Controles de navegação */}
        {renderNavigationControls()}

        {/* Contador de imagens */}
        {renderCounter()}
      </View>
    </Modal>
  );
}

// Path: src/features/company-page/components/gallery-image-viewer.tsx (continuação)
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  imageContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  navigationControls: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 20,
    right: 20,
    top: "50%",
    marginTop: -25,
    zIndex: 5,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 5,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
