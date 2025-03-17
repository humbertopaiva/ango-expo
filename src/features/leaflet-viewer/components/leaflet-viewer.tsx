// Path: src/features/leaflets/components/improved-leaflet-viewer.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, X, Share2, Store } from "lucide-react-native";
import { LeafletPage } from "../models/leaflet-viewer.model";
import { THEME_COLORS } from "@/src/styles/colors";
import { ResilientImage } from "@/components/common/resilient-image";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

const { width, height } = Dimensions.get("window");

interface LeafletViewerProps {
  pages: LeafletPage[];
  isVisible: boolean;
  onClose: () => void;
  companyName?: string;
  companyLogo?: string | null;
  leafletName?: string;
  dateValid?: string;
  initialPage?: number;
}

export function ImprovedLeafletViewer({
  pages,
  isVisible,
  onClose,
  companyName = "Empresa",
  companyLogo,
  leafletName = "Encarte",
  dateValid,
  initialPage = 0,
}: LeafletViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);

  // Preparar imagens para o ImageViewer
  const images: IImageInfo[] = pages.map((page) => ({
    url: page.image,
    props: { source: { uri: page.image } },
  }));

  // Função para compartilhar o encarte
  const handleShare = async () => {
    // Implementação futura para compartilhamento
    console.log("Compartilhar encarte:", companyName);
  };

  // Quando ocorre troca de página
  const handlePageChange = (index?: number) => {
    if (index !== undefined) {
      setCurrentPage(index);
    }
  };
  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#FFF" size={24} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {leafletName}
            </Text>
            {dateValid && (
              <Text style={styles.subtitle}>
                Válido até {new Date(dateValid).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.companyLogo}>
            {companyLogo ? (
              <ResilientImage
                source={companyLogo}
                style={{ width: 40, height: 40 }}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultLogo}>
                <Store size={20} color="#FFF" />
              </View>
            )}
          </View>
        </View>

        {/* Visualizador de imagens com zoom */}
        <ImageViewer
          imageUrls={images}
          index={initialPage}
          onChange={handlePageChange}
          backgroundColor="#000"
          renderIndicator={(currentIndex, allSize) => (
            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>
                {currentIndex}/{allSize}
              </Text>
            </View>
          )}
          loadingRender={() => (
            <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          )}
          enableSwipeDown
          onSwipeDown={onClose}
          saveToLocalByLongPress={false}
          pageAnimateTime={200}
          flipThreshold={10}
          maxOverflow={0}
          swipeDownThreshold={25}
          onLongPress={handleShare}
          renderFooter={() => (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={handleShare}
              >
                <Share2 size={20} color="#FFF" />
                <Text style={styles.footerButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          )}
          style={{ flex: 1 }}
        />

        {/* Thumbnails para navegação rápida */}
        <View style={styles.thumbnailContainer}>
          <FlatList
            data={pages}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.thumbnail,
                  currentPage === index && styles.activeThumbnail,
                ]}
                onPress={() => setCurrentPage(index)}
              >
                <ResilientImage
                  source={item.image}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                <View style={styles.thumbnailIndex}>
                  <Text style={styles.thumbnailIndexText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerContainer: {
    flex: 1,
  },
  pageIndicator: {
    position: "absolute",
    top: 10,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  pageIndicatorText: {
    color: "#FFF",
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footerButtonText: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 14,
  },
  thumbnailContainer: {
    height: 80,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  thumbnail: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: THEME_COLORS.primary,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailIndex: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
  },
  thumbnailIndexText: {
    color: "#FFF",
    fontSize: 10,
  },
});
