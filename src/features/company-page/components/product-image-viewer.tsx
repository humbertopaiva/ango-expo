// Path: src/features/company-page/components/product-image-viewer.tsx

import React from "react";
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
  ScrollView,
} from "react-native";
import { X, Share2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { Package } from "lucide-react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

interface ProductImageViewerProps {
  isVisible: boolean;
  imageUrl: string | null;
  onClose: () => void;
  productName: string;
  productDescription?: string | null;
  onShare?: () => void;
  companyName?: string;
}

export function ProductImageViewer({
  isVisible,
  imageUrl,
  onClose,
  productName,
  productDescription,
  onShare,
  companyName,
}: ProductImageViewerProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  // Configuração de animação para zoom
  const scale = new Animated.Value(1);

  // Calcular a altura para a imagem (60% da altura da tela para deixar espaço para a descrição)
  const imageHeight = height * 0.6;

  // Manipulador de gestos de pinça (zoom)
  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: true,
  });

  // Atualizar escala com base no gesto
  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 2,
      }).start();
    }
  };

  // Função para compartilhar o produto
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    // Caso o callback de compartilhamento não tenha sido fornecido
    const shareMessage = `Confira ${productName}${
      companyName ? ` em ${companyName}` : ""
    }`;

    try {
      await Share.share({
        message: shareMessage,
        title: productName,
      });
    } catch (error) {
      console.error("Erro ao compartilhar produto:", error);
    }
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

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Conteúdo com scroll para imagem e detalhes */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Área da imagem com zoom */}
          <PinchGestureHandler
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  height: imageHeight,
                  transform: [{ scale }],
                },
              ]}
            >
              <ImagePreview
                uri={imageUrl}
                width="100%"
                height="100%"
                resizeMode="contain"
                fallbackIcon={Package}
                containerClassName="bg-transparent"
              />
            </Animated.View>
          </PinchGestureHandler>

          {/* Detalhes do produto */}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{productName}</Text>
            {productDescription && (
              <Text style={styles.productDescription}>
                {productDescription}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 28,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 70, // Espaço para os botões de cabeçalho
    paddingBottom: 30,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  productDetails: {
    padding: 24,

    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
  },
});
