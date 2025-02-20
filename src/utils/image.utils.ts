// src/utils/image.utils.ts
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

export const imageUtils = {
  async validateImageUrl(url: string): Promise<boolean> {
    try {
      const timestampedUrl = this.addTimestamp(url);
      const response = await fetch(timestampedUrl, { method: "HEAD" });
      const contentType = response.headers.get("content-type");
      return (
        response.ok && contentType !== null && contentType.startsWith("image/")
      );
    } catch {
      return false;
    }
  },

  addTimestamp(url: string): string {
    const timestamp = new Date().getTime();
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${timestamp}`;
  },

  async uploadImage(
    uri: string,
    bucketName: string = "images",
    subFolder?: string
  ): Promise<{ url: string; path: string; error: Error | null }> {
    try {
      // Se já for uma URL do Supabase, retorna ela mesma
      if (uri.includes(bucketName)) {
        const path = uri.split(`${bucketName}/`)[1]?.split("?")[0];
        return { url: uri, path, error: null };
      }

      // Gera nome único para o arquivo
      const timestamp = new Date().getTime();
      const uniqueId = Math.random().toString(36).substring(2, 10);

      // Garante uma extensão válida
      let extension = "jpg"; // default
      if (Platform.OS === "web") {
        // Para web, vamos usar a extensão do tipo MIME
        const response = await fetch(uri);
        const contentType = response.headers.get("content-type");
        if (contentType) {
          extension = contentType.split("/")[1] || "jpg";
        }
      } else {
        // Para mobile, pega a extensão da URI
        const matches = uri.match(/\.([^.]+)$/);
        if (matches) {
          extension = matches[1].toLowerCase();
        }
      }

      // Formata o nome do arquivo de maneira mais limpa
      const fileName = `${uniqueId}_${timestamp}.${extension}`;

      // Constrói o caminho do arquivo com a subpasta se fornecida
      const filePath = subFolder ? `${subFolder}/${fileName}` : fileName;

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
          contentType: `image/${extension}`,
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
      console.error("Error uploading image:", error);
      return { url: "", path: "", error: error as Error };
    }
  },

  async deleteImage(
    path: string,
    bucketName: string = "images"
  ): Promise<{ error: Error | null }> {
    try {
      if (!path) return { error: null };

      // Remove timestamp e query params do path se existirem
      const cleanPath = path.split("?")[0].split("_").slice(0, -1).join("_");

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([cleanPath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting image:", error);
      return { error: error as Error };
    }
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
