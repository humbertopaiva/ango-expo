import React from "react";
import { View, Text, ViewStyle, StyleProp, DimensionValue } from "react-native";
import { Image as ImageIcon } from "lucide-react-native";
import { ResilientImage } from "@/components/common/resilient-image";

interface ImagePreviewProps {
  uri?: string | null;
  width?: number | string;
  height?: number | string;
  fallbackIcon?: React.ElementType;
  fallbackText?: string;
  containerClassName?: string;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
}

export function ImagePreview({
  uri,
  width = "100%",
  height = "100%",
  fallbackIcon = ImageIcon,
  fallbackText = "Sem imagem",
  containerClassName = "",
  resizeMode = "cover",
  style,
  rounded = true,
}: ImagePreviewProps) {
  const Icon = fallbackIcon;

  if (!uri) {
    return (
      <View
        className={`border bg-gray-100 items-center justify-center ${containerClassName}`}
        style={[
          {
            width: width as DimensionValue,
            height: height as DimensionValue,
            borderRadius: rounded ? 8 : 0,
          },
          style,
        ]}
      >
        <Icon size={32} color="#6B7280" />
      </View>
    );
  }

  return (
    <View
      className={`overflow-hidden ${containerClassName}`}
      style={[
        {
          width: width as DimensionValue,
          height: height as DimensionValue,
          borderRadius: rounded ? 8 : 0,
        },
        style,
      ]}
    >
      <ResilientImage
        source={uri}
        style={{ width: "100%", height: "100%" }}
        resizeMode={resizeMode}
        fallbackSource={<Icon size={32} color="#6B7280" />}
      />
    </View>
  );
}
