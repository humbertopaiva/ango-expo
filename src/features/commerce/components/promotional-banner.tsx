// Path: src/features/commerce/components/promotional-banner.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";

export interface BannerItem {
  id: number | string;
  image: string;
  link?: string;
  title?: string;
}

interface PromotionalBannerProps {
  /**
   * Banner para exibir (opcional - usa o padrão se não fornecido)
   */
  banner?: BannerItem;

  /**
   * Se o banner deve ter bordas arredondadas
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
   * Função chamada quando o banner é clicado
   */
  onBannerPress?: (banner: BannerItem) => void;
}

// Banner padrão caso não seja fornecido via props
const DEFAULT_BANNER: BannerItem = {
  id: 1,
  image:
    "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-1.jpg",
  link: "/promo1",
  title: "Ofertas Especiais",
};

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  banner = DEFAULT_BANNER,
  rounded = true,
  borderRadius = 8,
  mobileHeight = 160,
  desktopHeight = 280,
  onBannerPress,
}) => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const isWeb = Platform.OS === "web";

  // Determina a altura do banner com base na plataforma
  const bannerHeight = isWeb && width >= 768 ? desktopHeight : mobileHeight;

  // Função para lidar com o clique no banner
  const handleBannerPress = () => {
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

  return (
    <View
      className="w-full relative mb-6 overflow-hidden"
      style={[
        rounded && { borderRadius },
        styles.container,
        { height: bannerHeight },
      ]}
    >
      <TouchableOpacity
        style={{ width, height: bannerHeight }}
        activeOpacity={0.9}
        onPress={handleBannerPress}
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
