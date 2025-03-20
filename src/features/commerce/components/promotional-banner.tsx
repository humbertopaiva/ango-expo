// Path: src/features/commerce/components/promotional-banner.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useNavigation } from "expo-router";

export interface BannerItem {
  id: number | string;
  image: string;
  link?: string;
  title?: string;
}

interface PromotionalBannerProps {
  /**
   * Array de banners para exibir no carrossel
   */
  banners?: BannerItem[];

  /**
   * Duração de cada slide em ms (padrão: 5000ms)
   */
  autoplayInterval?: number;

  /**
   * Se o carrossel deve ter bordas arredondadas
   */
  rounded?: boolean;

  /**
   * Valor do raio das bordas (padrão: 8)
   */
  borderRadius?: number;

  /**
   * Altura do banner em telas móveis (padrão: 160px)
   */
  mobileHeight?: number;

  /**
   * Altura do banner em telas desktop (padrão: 280px)
   */
  desktopHeight?: number;

  /**
   * Se o carrossel deve avançar automaticamente
   */
  autoplay?: boolean;

  /**
   * Função chamada quando um banner é clicado
   */
  onBannerPress?: (banner: BannerItem) => void;
}

// Banners padrão caso não sejam fornecidos via props
const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 1,
    image:
      "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-1.jpg",
    link: "/promo1",
    title: "Ofertas Especiais",
  },
  {
    id: 2,
    image:
      "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-2.jpg",
    link: "/promo2",
    title: "Novidades da Semana",
  },
];

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  banners = DEFAULT_BANNERS,
  autoplayInterval = 5000,
  rounded = true,
  borderRadius = 8,
  mobileHeight = 160,
  desktopHeight = 280,
  autoplay = true,
  onBannerPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const isWeb = Platform.OS === "web";

  // Determina a altura do banner com base na plataforma
  const bannerHeight = isWeb && width >= 768 ? desktopHeight : mobileHeight;

  // Função para lidar com o clique no banner
  const handleBannerPress = (banner: BannerItem) => {
    if (onBannerPress) {
      onBannerPress(banner);
    } else if (banner.link) {
      // Assumindo que o link é um caminho válido para o expo-router
      try {
        navigation.navigate(banner.link as never);
      } catch (error) {
        console.log("Erro ao navegar:", error);
      }
    }
  };

  // Configurar e limpar o intervalo do autoplay
  useEffect(() => {
    if (autoplay && banners.length > 1) {
      startAutoplay();
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, banners.length, currentIndex, width]);

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, autoplayInterval);
  };

  // Pause autoplay quando o usuário interagir
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  // Retoma o autoplay após interação do usuário
  const resumeAutoplay = () => {
    if (autoplay && !autoplayRef.current) {
      startAutoplay();
    }
  };

  const handlePrevious = () => {
    pauseAutoplay();
    const newIndex = (currentIndex - 1 + banners.length) % banners.length;
    setCurrentIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
    resumeAutoplay();
  };

  const handleNext = () => {
    pauseAutoplay();
    const newIndex = (currentIndex + 1) % banners.length;
    setCurrentIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
    resumeAutoplay();
  };

  const handleScroll = (event: any) => {
    pauseAutoplay();
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < banners.length
    ) {
      setCurrentIndex(newIndex);
    }
    resumeAutoplay();
  };

  // Se não houver banners, não renderiza nada
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View
      className="w-full relative mb-6 overflow-hidden"
      style={[
        rounded && { borderRadius },
        styles.container,
        { height: bannerHeight },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollBeginDrag={pauseAutoplay}
        onScrollEndDrag={resumeAutoplay}
        className="w-full h-full"
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            style={{ width, height: bannerHeight }}
            activeOpacity={0.9}
            onPress={() => handleBannerPress(banner)}
          >
            <Image
              source={{ uri: banner.image }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores de slide */}
      <View className="absolute bottom-4 inset-x-0 flex flex-row justify-center items-center space-x-1.5">
        {banners.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </View>

      {/* Contador de slides */}
      <View className="absolute bottom-4 right-4">
        <Text className="text-white text-xs bg-black/40 px-2 py-1 rounded-full">
          {currentIndex + 1}/{banners.length}
        </Text>
      </View>

      {/* Botões de navegação (visíveis apenas em desktop) */}
      {banners.length > 1 && (
        <>
          <TouchableOpacity
            onPress={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 rounded-full p-2 hidden md:flex"
          >
            <ChevronLeft size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 rounded-full p-2 hidden md:flex"
          >
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
