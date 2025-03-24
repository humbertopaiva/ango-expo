// Path: src/utils/pdf.utils.ts

import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

export const pdfUtils = {
  async uploadPdf(
    uri: string,
    bucketName: string = "images", // Usar o mesmo bucket das imagens
    companyId?: string
  ): Promise<{ url: string; path: string; error: Error | null }> {
    try {
      // Se já for uma URL do Supabase, retorna ela mesma
      if (uri.includes(bucketName)) {
        const path = uri.split(`${bucketName}/`)[1]?.split("?")[0];
        return { url: uri, path, error: null };
      }

      if (!companyId) {
        throw new Error("ID da empresa não fornecido para upload do PDF");
      }

      // Gera nome único para o arquivo
      const timestamp = new Date().getTime();
      const uniqueId = Math.random().toString(36).substring(2, 10);

      // Nome do arquivo com timestamp para evitar conflitos
      const fileName = `${uniqueId}_${timestamp}.pdf`;

      // Estrutura do caminho: company_id/pdf/filename.pdf
      const filePath = `${companyId}/pdf/${fileName}`;

      let arrayBuffer: ArrayBuffer;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        arrayBuffer = await response.arrayBuffer();
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        arrayBuffer = this.base64ToArrayBuffer(base64);
      }

      // Faz o upload com o novo caminho
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Pega a URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      return {
        url: this.addTimestamp(publicUrl),
        path: filePath,
        error: null,
      };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { url: "", path: "", error: error as Error };
    }
  },

  async deletePdf(
    path: string,
    bucketName: string = "images"
  ): Promise<{ error: Error | null }> {
    try {
      if (!path) return { error: null };

      // Remove timestamp e query params do path se existirem
      const cleanPath = path.split("?")[0];

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([cleanPath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting PDF:", error);
      return { error: error as Error };
    }
  },

  addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${timestamp}`;
  },

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
};
