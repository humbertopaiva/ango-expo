// Path: src/features/leaflets/screens/pdf-viewer-screen.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { X, Calendar, Store } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { formatToBrazilianDate } from "@/src/utils/date.utils";
import NativePdfViewer from "@/components/pdf/native-pdf-viewer";

interface PdfViewerScreenProps {
  pdfUrl: string;
  title?: string;
  companyName?: string;
  validUntil?: string;
  onClose: () => void;
  onError?: (error: Error) => void;
}

export const PdfViewerScreen = ({
  pdfUrl,
  title,
  companyName,
  validUntil,
  onClose,
  onError,
}: PdfViewerScreenProps) => {
  const insets = useSafeAreaInsets();

  // Calcular altura do header baseado nos insets
  const headerHeight = Math.max(insets.top + 60, 75);

  // Formatar data de validade se existir
  const formattedDate = validUntil ? formatToBrazilianDate(validUntil) : null;

  return (
    <View style={styles.container}>
      {/* Configurar StatusBar para modo claro */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.primary}
        translucent={true}
      />

      {/* Header com informações do encarte */}
      <View
        style={[
          styles.header,
          { height: headerHeight, paddingTop: insets.top, paddingBottom: 10 },
        ]}
      >
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {title || "Visualizador de PDF"}
          </Text>

          {companyName && (
            <View style={styles.companyContainer}>
              <Store size={14} color="#fff" style={{ opacity: 0.9 }} />
              <Text style={styles.companyName} numberOfLines={1}>
                {companyName}
              </Text>
            </View>
          )}

          {formattedDate && (
            <View style={styles.dateContainer}>
              <Calendar size={12} color="#fff" style={{ opacity: 0.8 }} />
              <Text style={styles.dateText}>Válido até {formattedDate}</Text>
            </View>
          )}
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        <NativePdfViewer pdfUrl={pdfUrl} onError={onError} title={title} />
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: THEME_COLORS.primary,

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  title: {
    width: windowWidth - 120, // Ajuste para evitar sobreposição com botões
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  companyName: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginLeft: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 12,
    marginLeft: 4,
  },
  placeholder: {
    width: 40,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
