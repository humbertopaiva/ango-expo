// Path: src/components/common/pdf-upload.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FileText, Upload, X, File } from "lucide-react-native";
import { fileUtils } from "@/src/utils/file.utils";
import { WebViewPdfViewer } from "@/components/pdf/webview-pdf-viewer";
import { THEME_COLORS } from "@/src/styles/colors";
import useAuthStore from "@/src/stores/auth";
import { pdfUtils } from "@/src/utils/pdf.utils";

interface PdfUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PdfUpload({
  value,
  onChange,
  disabled = false,
}: PdfUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selecionar um arquivo PDF
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedAsset = result.assets[0];
      if (selectedAsset) {
        uploadPdf(selectedAsset.uri);
      }
    } catch (err) {
      console.error("Erro ao selecionar PDF:", err);
      setError("Não foi possível selecionar o PDF. Tente novamente.");
    }
  };

  // Fazer upload do PDF para o Supabase
  const uploadPdf = async (uri: string) => {
    setIsUploading(true);
    setError(null);

    try {
      // Obter ID da empresa do store
      const companyId = useAuthStore.getState().getCompanyId();
      if (!companyId) {
        throw new Error("ID da empresa não encontrado");
      }

      const result = await pdfUtils.uploadPdf(uri, "images", companyId);

      if (result.error) {
        throw result.error;
      }

      if (result.url) {
        onChange(result.url);
      }
    } catch (err) {
      console.error("Erro ao fazer upload do PDF:", err);
      setError("Não foi possível fazer o upload do PDF. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remover o PDF
  const removePdf = () => {
    onChange("");
  };

  // Verificar se há um PDF selecionado
  const hasPdf = !!value;

  return (
    <View className="mt-2">
      {!hasPdf ? (
        <TouchableOpacity
          onPress={pickPdf}
          disabled={disabled || isUploading}
          className={`border-2 border-dashed rounded-lg p-6 items-center justify-center ${
            disabled ? "opacity-50 border-gray-300" : "border-primary-300"
          }`}
          style={{ minHeight: 120 }}
        >
          {isUploading ? (
            <View className="items-center">
              <ActivityIndicator size="large" color={THEME_COLORS.primary} />
              <Text className="text-primary-700 mt-2">Enviando PDF...</Text>
            </View>
          ) : (
            <View className="items-center">
              <View
                className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mb-2"
                style={{ backgroundColor: `${THEME_COLORS.primary}20` }}
              >
                <Upload size={24} color={THEME_COLORS.primary} />
              </View>
              <Text className="text-primary-700 font-medium text-base">
                Selecionar arquivo PDF
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                Clique para selecionar um arquivo PDF do seu dispositivo
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View className="border rounded-lg overflow-hidden">
          <View className="flex-row items-center justify-between bg-gray-50 p-3 border-b">
            <View className="flex-row items-center">
              <File size={18} color="#6B7280" />
              <Text
                className="ml-2 font-medium text-gray-700"
                numberOfLines={1}
              >
                PDF do encarte
              </Text>
            </View>
            <TouchableOpacity
              onPress={removePdf}
              disabled={disabled}
              className="p-2"
            >
              <X size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View className="h-32">
            {Platform.OS === "web" ? (
              <iframe
                src={value}
                className="w-full h-full"
                style={{ border: "none" }}
              />
            ) : (
              <WebViewPdfViewer
                pdfUrl={value}
                onError={() => setError("Não foi possível carregar o PDF.")}
              />
            )}
          </View>
        </View>
      )}

      {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}
    </View>
  );
}
