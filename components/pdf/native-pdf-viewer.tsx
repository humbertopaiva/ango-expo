// Path: src/components/pdf/native-pdf-viewer.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import Pdf from "react-native-pdf";
import { THEME_COLORS } from "@/src/styles/colors";
import { Share2 } from "lucide-react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

interface NativePdfViewerProps {
  pdfUrl: string;
  onError?: (error: Error) => void;
  title?: string;
}

const NativePdfViewer = ({ pdfUrl, onError, title }: NativePdfViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [localFilePath, setLocalFilePath] = useState<string | null>(null);

  const handleLoadComplete = (pageCount: number, filePath: string) => {
    setLoading(false);
    setNumberOfPages(pageCount);

    // Em iOS e Android, o caminho local do arquivo é fornecido pelo callback
    setLocalFilePath(filePath);
  };

  const handleError = (error: object) => {
    setLoading(false);
    console.error("Error loading PDF:", error);
    if (onError) onError(error as Error);
  };

  const handleShare = async () => {
    if (isSharing || !localFilePath) return;

    setIsSharing(true);

    try {
      // Para iOS, podemos usar diretamente o localFilePath
      if (Platform.OS === "ios" && localFilePath) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(localFilePath, {
            UTI: "com.adobe.pdf",
            mimeType: "application/pdf",
            dialogTitle: title || "Compartilhar PDF",
          });
        }
      }
      // Para Android, precisamos baixar novamente
      else {
        const fileName = pdfUrl.split("/").pop() || "document.pdf";
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.downloadAsync(pdfUrl, fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: title || "Compartilhar PDF",
          });
        }
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={{
          uri: pdfUrl,
          cache: true,
        }}
        trustAllCerts={false}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        onPageChanged={(page, pageCount) => {
          console.log(`Página atual: ${page} de ${pageCount}`);
        }}
        enablePaging={Platform.OS === "ios"} // Paginação funciona melhor no iOS
        horizontal={false}
        spacing={8}
        renderActivityIndicator={(progress) => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME_COLORS.primary} />
            <Text style={styles.loadingText}>
              Carregando encarte
              {progress ? ` (${Math.round(progress * 100)}%)` : "..."}
            </Text>
            {progress > 0 && progress < 1 && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${Math.round(progress * 100)}%` },
                  ]}
                />
              </View>
            )}
            <Text style={styles.loadingSubtext}>
              Isso pode levar alguns instantes
            </Text>
          </View>
        )}
        style={styles.pdf}
      />

      {/* Botão de compartilhar */}
      {!loading && (
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Share2 size={20} color="#fff" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  shareButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  progressBarContainer: {
    width: "80%",
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: THEME_COLORS.primary,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
});

export default NativePdfViewer;
