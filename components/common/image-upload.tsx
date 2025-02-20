// src/components/common/image-upload.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Upload, Trash2, ImageIcon } from "lucide-react-native";
import { Button } from "@gluestack-ui/themed";
import { pickImage, uploadFile, deleteFile } from "@/src/lib/supabase/storage";

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

  const handleSelectImage = async () => {
    if (disabled || isUploading) return;

    try {
      const result = await pickImage();
      if (!result) return;

      setIsUploading(true);
      const { url, path } = await uploadFile(result);

      onChange(url);
      if (onPathChange) onPathChange(path);
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value || disabled || isUploading) return;

    try {
      if (onPathChange) {
        await deleteFile(value);
        onPathChange(null);
      }
      onChange(null);
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    }
  };

  if (value) {
    return (
      <View className="w-full">
        <View className="relative">
          {/* Imagem */}
          <View className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <Image
              source={{ uri: value }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Botão de remover */}
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
      {isUploading ? (
        <View className="items-center space-y-2">
          <ActivityIndicator size="large" color="#0891B2" />
          <Text className="text-gray-500">Enviando imagem...</Text>
        </View>
      ) : (
        <View className="items-center space-y-2">
          <Upload color="#0891B2" size={32} />
          <Text className="text-base font-medium text-gray-700">
            Toque para selecionar imagem
          </Text>
          <Text className="text-sm text-gray-500">JPG, PNG, GIF (max 5MB)</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
