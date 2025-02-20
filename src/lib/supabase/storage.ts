// src/lib/supabase/storage.ts
import { toByteArray } from "base64-js";

import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { supabase } from "../supabase";

export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error("Permission to access media library was denied");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export async function uploadFile(
  imageAsset: ImagePicker.ImagePickerAsset,
  bucket: string = "images"
) {
  try {
    // Criar um nome único para o arquivo
    const fileExt = imageAsset.uri.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .slice(2)}_${Date.now()}.${fileExt}`;

    let base64Data: string;

    if (Platform.OS === "web") {
      // Para web, convertemos a URI diretamente
      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      base64Data = await new Promise((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]);
          }
        };
        reader.readAsDataURL(blob);
      });
    } else {
      // Para mobile, usamos o FileSystem do Expo
      if (imageAsset.base64) {
        base64Data = imageAsset.base64;
      } else {
        const fileContent = await FileSystem.readAsStringAsync(imageAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        base64Data = fileContent;
      }
    }

    const decodedFile = toByteArray(base64Data);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, decodedFile, {
        contentType: `image/${fileExt}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Pegar a URL pública do arquivo
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
}

export async function deleteFile(path: string, bucket: string = "images") {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}

export function getPublicUrl(path: string, bucket: string = "images") {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}
