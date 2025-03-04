// Path: src/features/categories/components/category-image-uploader.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Upload, Trash2, Edit, Image as ImageIcon } from "lucide-react-native";
import { Button } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";

import { ResilientImage } from "@/components/common/resilient-image";
import { imageUtils } from "@/src/utils/image.utils";
import useAuthStore from "@/src/stores/auth";

interface CategoryImageUploaderProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onPathChange?: (path: string | null) => void;
  disabled?: boolean;
  showEditOption?: boolean;
}

export function CategoryImageUploader({
  value,
  onChange,
  onPathChange,
  disabled,
  showEditOption = true,
}: CategoryImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const companyId = useAuthStore((state) => state.getCompanyId());

  const handleSelectImage = async () => {
    if (disabled || isUploading) return;

    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;

          setIsUploading(true);
          const blob = new Blob([file], { type: file.type });
          const fileUrl = URL.createObjectURL(blob);

          const { url, path, error } = await imageUtils.uploadImage(
            fileUrl,
            "images",
            companyId || undefined
          );

          if (error) throw error;

          onChange(url);
          if (onPathChange) onPathChange(path);

          URL.revokeObjectURL(fileUrl);
          setIsUploading(false);
        };

        input.click();
      } else {
        // Solicitar permissão para acessar a galeria
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Precisamos de permissão para acessar suas fotos!",
            [{ text: "OK" }]
          );
          return;
        }

        // Abrir o seletor de imagens
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1], // Proporção quadrada para ícones de categoria
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setIsUploading(true);

          const { url, path, error } = await imageUtils.uploadImage(
            result.assets[0].uri,
            "images",
            companyId || undefined
          );

          if (error) throw error;

          onChange(url);
          if (onPathChange) onPathChange(path);
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert(
        "Erro",
        "Não foi possível fazer upload da imagem. Tente novamente.",
        [{ text: "OK" }]
      );
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value || disabled || isUploading) return;

    // Confirmação para remover a imagem
    Alert.alert(
      "Remover imagem",
      "Tem certeza que deseja remover esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setIsUploading(true);
              const path = value.split("images/")[1]?.split("?")[0];

              if (path) {
                const { error } = await imageUtils.deleteImage(path);
                if (error) throw error;
              }

              onChange(null);
              if (onPathChange) onPathChange(null);
              setIsUploading(false);
            } catch (error) {
              console.error("Erro ao remover imagem:", error);
              Alert.alert(
                "Erro",
                "Não foi possível remover a imagem. Tente novamente."
              );
              setIsUploading(false);
            }
          },
        },
      ]
    );
  };

  // Se já tem uma imagem, mostra a imagem com opções de editar/remover
  if (value) {
    return (
      <View className="w-full">
        <View className="relative">
          <View className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 max-w-[200px]">
            <ResilientImage
              source={value}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {showEditOption && (
            <View className="absolute top-2 right-2 flex-row">
              <TouchableOpacity
                onPress={handleSelectImage}
                disabled={disabled || isUploading}
                className="bg-white w-8 h-8 rounded-full shadow items-center justify-center mr-2"
              >
                <Edit size={16} color="#4B5563" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRemove}
                disabled={disabled || isUploading}
                className="bg-white w-8 h-8 rounded-full shadow items-center justify-center"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* Botões para substituir/remover a imagem */}
          {showEditOption && (
            <View className="flex-row mt-3">
              <Button
                variant="outline"
                onPress={handleSelectImage}
                disabled={disabled || isUploading}
                size="sm"
                className="mr-2"
              >
                <Button.Icon as={Edit} size="sm" />
                <Button.Text>Substituir</Button.Text>
              </Button>

              <Button
                variant="outline"
                onPress={handleRemove}
                disabled={disabled || isUploading}
                size="sm"
                className="bg-red-50 border-red-200"
              >
                <Button.Icon as={Trash2} color="#EF4444" size="sm" />
                <Button.Text className="text-red-500">Remover</Button.Text>
              </Button>
            </View>
          )}

          {/* Indicador de carregamento */}
          {isUploading && (
            <View className="absolute inset-0 bg-black/30 items-center justify-center rounded-lg">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
        </View>
      </View>
    );
  }

  // Se não tem imagem, mostra o uploader vazio
  return (
    <TouchableOpacity
      onPress={handleSelectImage}
      disabled={disabled || isUploading}
      className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 
               bg-gray-50 items-center justify-center p-4 max-w-[200px]"
    >
      <View className="items-center space-y-2">
        {isUploading ? (
          <>
            <ActivityIndicator size="small" color="#0891B2" />
            <Text className="text-base font-medium text-gray-700">
              Enviando...
            </Text>
          </>
        ) : (
          <>
            <Upload color="#0891B2" size={32} />
            <Text className="text-base font-medium text-gray-700 text-center">
              Clique para selecionar imagem
            </Text>
            <Text className="text-xs text-gray-500 text-center">
              PNG, JPG, GIF (máx. 5MB)
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
