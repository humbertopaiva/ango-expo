// Path: src/features/company-page/components/product-header-overlay.tsx

import React from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";

interface ProductHeaderOverlayProps {
  onBack: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  topInset: number;
}

export function ProductHeaderOverlay({
  onBack,
  onShare,
  onToggleFavorite,
  isFavorite,
  topInset,
}: ProductHeaderOverlayProps) {
  return (
    <View className="z-10">
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "transparent"]}
        style={{ height: 60 + (topInset || 0) }}
      >
        <View
          className="flex-row justify-between items-center px-4"
          style={{ marginTop: topInset || 10 }}
        >
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-row">
            <TouchableOpacity
              onPress={onShare}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
