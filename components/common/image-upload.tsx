// src/components/common/image-upload.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Upload, Trash2 } from "lucide-react-native";
import { Button } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";

import { ResilientImage } from "./resilient-image";
import { imageUtils } from "@/src/utils/image.utils";
import useAuthStore from "@/src/stores/auth";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onPathChange?: (path: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onPathChange,
  disabled,
}: ImageUploadProps) {
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

          // Criar um objeto Blob com o tipo correto
          const blob = new Blob([file], { type: file.type });
          const fileUrl = URL.createObjectURL(blob);

          // Passa o ID da empresa como subpasta
          const { url, path, error } = await imageUtils.uploadImage(
            fileUrl,
            "images",
            companyId || undefined
          );

          if (error) throw error;

          onChange(url);
          if (onPathChange) onPathChange(path);

          URL.revokeObjectURL(fileUrl);
        };

        input.click();
      } else {
        // ... código do mobile permanece igual ...
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value || disabled || isUploading) return;

    try {
      setIsUploading(true);
      const path = value.split("images/")[1]?.split("?")[0];
      if (path) {
        const { error } = await imageUtils.deleteImage(path);
        if (error) throw error;
      }
      onChange(null);
      if (onPathChange) onPathChange(null);
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <View className="w-full">
        <View className="relative">
          <View className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <ResilientImage
              source={value}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          <View className="absolute top-2 right-2">
            <Button
              variant="solid"
              bgColor="$red500"
              onPress={handleRemove}
              disabled={disabled || isUploading}
              size="sm"
            >
              <Button.Icon as={Trash2} color="white" />
              <Button.Text color="white">Remover</Button.Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleSelectImage}
      disabled={disabled || isUploading}
      className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 
                 bg-gray-50 items-center justify-center p-4"
    >
      <View className="items-center space-y-2">
        <Upload color="#0891B2" size={32} />
        <Text className="text-base font-medium text-gray-700">
          {isUploading ? "Enviando imagem..." : "Toque para selecionar imagem"}
        </Text>
        <Text className="text-sm text-gray-500">JPG, PNG, GIF (max 5MB)</Text>
      </View>
    </TouchableOpacity>
  );
}
