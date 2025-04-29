// Path: src/features/company-page/components/variation-image-carousel.tsx
import React, { useState, useRef } from "react";
import { View, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface VariationImageCarouselProps {
  images: string[];
  onImagePress: () => void;
}

export function VariationImageCarousel({
  images,
  onImagePress,
}: VariationImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  // Handle page change
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (activeIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex - 1) * width,
        animated: true,
      });
    }
  };

  // Navigate to next image
  const goToNext = () => {
    if (activeIndex < images.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
    }
  };

  // If only one image or no images, render a simple image
  if (images.length <= 1) {
    return (
      <TouchableOpacity
        onPress={onImagePress}
        activeOpacity={0.95}
        className="w-full h-full"
      >
        <ImagePreview
          uri={images[0]}
          width="100%"
          height="100%"
          resizeMode="cover"
          containerClassName="bg-gray-100"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View className="w-full h-full">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={`image-${index}`}
            onPress={onImagePress}
            activeOpacity={0.95}
            style={{ width, height: "100%" }}
          >
            <ImagePreview
              uri={image}
              width="100%"
              height="100%"
              resizeMode="cover"
              containerClassName="bg-gray-100"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <TouchableOpacity
          onPress={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-6 bg-black/40 rounded-full p-2"
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {activeIndex < images.length - 1 && (
        <TouchableOpacity
          onPress={goToNext}
          className="absolute right-4 top-1/2 -translate-y-6 bg-black/40 rounded-full p-2"
        >
          <ChevronRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Pagination dots */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
        {images.map((_, index) => (
          <View
            key={`dot-${index}`}
            className={`h-2 w-2 rounded-full ${
              activeIndex === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
