// src/features/leaflets/components/leaflet-viewer.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
} from "lucide-react-native";
import { Leaflet } from "../models/leaflet";
import { ResilientImage } from "@/components/common/resilient-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();

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

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: leaflet.nome,
        message: `Confira o encarte "${leaflet.nome}" de ${leaflet.empresa.nome}`,
        url: images[currentImageIndex],
      });
    } catch (error) {
      Alert.alert(
        "Erro ao compartilhar",
        "Não foi possível compartilhar este encarte."
      );
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleDownload = () => {
    // No ambiente móvel, isso não é tão direto quanto na web
    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = images[currentImageIndex];
      link.download = `${leaflet.nome}-pagina-${currentImageIndex + 1}.jpg`;
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
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        {/* Barra superior */}
        <View className="flex-row items-center justify-between bg-white/90 h-14 px-4">
          <View className="flex-row items-center">
            <Text className="font-medium mx-2">
              Página {currentImageIndex + 1} de {images.length}
            </Text>
            <View className="h-4 w-px bg-gray-300 mx-2" />
            <Text className="text-sm text-gray-600" numberOfLines={1}>
              {leaflet.empresa.nome}
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleDownload} className="p-2">
              <Download size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} className="p-2 ml-2">
              <Share2 size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} className="p-2 ml-2">
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Área da imagem */}
        <View className="flex-1 items-center justify-center">
          {images.length > 0 ? (
            <ResilientImage
              source={images[currentImageIndex]}
              style={{ width: "100%", height: "90%" }}
              resizeMode="contain"
              fallbackSource={<View className="bg-gray-200 w-full h-full" />}
            />
          ) : (
            <View className="items-center justify-center">
              <Text className="text-white text-center">
                Não há imagens disponíveis para este encarte.
              </Text>
            </View>
          )}

          {/* Navegação */}
          {images.length > 1 && (
            <>
              <TouchableOpacity
                onPress={handlePrevious}
                className="absolute left-4 bg-white/80 rounded-full p-3"
                style={{ top: "50%", transform: [{ translateY: -25 }] }}
              >
                <ChevronLeft size={24} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                className="absolute right-4 bg-white/80 rounded-full p-3"
                style={{ top: "50%", transform: [{ translateY: -25 }] }}
              >
                <ChevronRight size={24} color="#374151" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
