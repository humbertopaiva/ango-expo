// Path: src/utils/document-picker.utils.ts

import * as DocumentPicker from "expo-document-picker";
import { fileUtils } from "./file.utils";
import { Platform } from "react-native";

export const documentPickerUtils = {
  async pickPdf(): Promise<string | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const selectedAsset = result.assets[0];
      if (selectedAsset) {
        return selectedAsset.uri;
      }

      return null;
    } catch (err) {
      console.error("Erro ao selecionar PDF:", err);
      return null;
    }
  },

  async uploadPdf(uri: string, subFolder?: string): Promise<string | null> {
    try {
      const result = await fileUtils.uploadPdf(uri, "pdfs", subFolder);

      if (result.error) {
        throw result.error;
      }

      return result.url;
    } catch (err) {
      console.error("Erro ao fazer upload do PDF:", err);
      return null;
    }
  },
};
