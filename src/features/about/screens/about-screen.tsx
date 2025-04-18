// Path: src/features/about/screens/about-screen.tsx
import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useAboutViewModel } from "../viewmodels/about-view-model";
import { AboutHeader } from "../components/about-header";
import { MissionVision } from "../components/mission-vision";
import { ValuesSection } from "../components/values-section";
import { HistoryTimeline } from "../components/history-timeline";
import { CallToAction } from "../components/call-to-action";
import ScreenHeader from "@/components/ui/screen-header";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AboutScreen() {
  const { aboutInfo, isLoading, contactViaWhatsApp } = useAboutViewModel();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
      </View>
    );
  }

  if (!aboutInfo) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <StatusBar
          backgroundColor={THEME_COLORS.primary}
          barStyle="light-content"
        />
        <Text className="text-gray-600 text-center font-medium">
          Não foi possível carregar as informações. Tente novamente mais tarde.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor={THEME_COLORS.primary}
        barStyle="light-content"
      />
      <ScreenHeader
        title="Sobre Nós"
        subtitle="Nossa história e missão"
        variant="primary"
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <AboutHeader />

        <MissionVision mission={aboutInfo.mission} vision={aboutInfo.vision} />

        <ValuesSection values={aboutInfo.values} />

        <HistoryTimeline history={aboutInfo.history} />

        <CallToAction onPress={contactViaWhatsApp} />
      </ScrollView>
    </View>
  );
}
