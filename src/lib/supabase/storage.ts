import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { supabase } from "../supabase";

/**
 * Seleciona uma imagem da galeria do dispositivo
 */
export async function pickImage(): Promise<string | null> {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}

/**
 * Faz o upload de uma imagem para o Supabase
 */
export async function uploadFile(uri: string, bucket: string = "images") {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .slice(2)}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { path: data.path, url: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    Alert.alert("Erro", "Não foi possível enviar a imagem.");
    return null;
  }
}

/**
 * Deleta um arquivo do Supabase
 */
export async function deleteFile(path: string, bucket: string = "images") {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error("Erro ao deletar arquivo:", error);
    Alert.alert("Erro", "Não foi possível deletar a imagem.");
  }
}

/**
 * Obtém a URL pública de um arquivo do Supabase
 */
export function getPublicUrl(path: string, bucket: string = "images") {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
