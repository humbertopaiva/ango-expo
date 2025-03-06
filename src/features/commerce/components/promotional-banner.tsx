// Path: src/features/commerce/components/promotional-banner.tsx
import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface Banner {
  id: number;
  image: string;
  link: string;
  title: string;
}

const mockBanners: Banner[] = [
  {
    id: 1,
    image:
      "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-1.jpg",
    link: "/promo1",
    title: "Ofertas Especiais",
  },
  {
    id: 2,
    image:
      "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-2.jpg",
    link: "/promo2",
    title: "Novidades da Semana",
  },
  {
    id: 3,
    image:
      "https://ywxeaxheqzpogiztqvzk.supabase.co/storage/v1/object/public/images/mktplace-web/banners/home/banner-site-3.jpg",
    link: "/promo3",
    title: "Descontos Imperdíveis",
  },
];

export const PromotionalBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const handlePrevious = useCallback(() => {
    const newIndex =
      (currentIndex - 1 + mockBanners.length) % mockBanners.length;
    setCurrentIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
  }, [currentIndex, width]);

  const handleNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % mockBanners.length;
    setCurrentIndex(newIndex);
    scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
  }, [currentIndex, width]);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <View className="w-full relative mb-6">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        className="w-full"
      >
        {mockBanners.map((banner, index) => (
          <View
            key={banner.id}
            style={{ width }}
            className="h-[160px] md:h-[280px]"
          >
            <Image
              source={{ uri: banner.image }}
              className="w-full h-full object-cover"
              style={{ resizeMode: "cover" }}
            />
            {banner.title ? (
              <View className="absolute bottom-8 left-4">
                <Text className="text-white bg-black/40 px-4 py-2 rounded-lg text-lg font-bold">
                  {banner.title}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-4 inset-x-0 flex flex-row justify-center items-center space-x-1.5">
        {mockBanners.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </View>

      <View className="absolute bottom-4 right-4">
        <Text className="text-white text-xs bg-black/40 px-2 py-1 rounded-full">
          {currentIndex + 1}/{mockBanners.length}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handlePrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 rounded-full p-2 hidden md:flex"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 rounded-full p-2 hidden md:flex"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </TouchableOpacity>
    </View>
  );
};
