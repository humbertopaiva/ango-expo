import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/ui/screen-header";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { BasicInfoSection } from "../components/basic-info/basic-info-section";
import { ContactSection } from "../components/contact/contact-section";
import { SocialSection } from "../components/social/social-section";
import { HoursSection } from "../components/hours/hours-section";
import { VisualSection } from "../components/visual/visual-section";
import { PaymentSection } from "../components/payment/payment-section";
import { AdditionalSection } from "../components/additional/additional-section";
import { Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { useProfileContext } from "../contexts/use-profile-context";

const routes = [
  { key: "basic", title: "Info Básica" },
  { key: "contact", title: "Contato" },
  { key: "social", title: "Redes Sociais" },
  { key: "hours", title: "Horários" },
  { key: "visual", title: "Visual" },
  { key: "payment", title: "Pagamento" },
  // { key: "additional", title: "Adicional" },
];

const renderScene = SceneMap({
  basic: BasicInfoSection,
  contact: ContactSection,
  social: SocialSection,
  hours: HoursSection,
  visual: VisualSection,
  payment: PaymentSection,
  // additional: AdditionalSection,
});

export function ProfileContent() {
  const vm = useProfileContext();
  const layout = useWindowDimensions();
  const index = routes.findIndex((route) => route.key === vm.activeTab);

  const renderTabBar = (props: any) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-200"
    >
      <TabBar
        {...props}
        scrollEnabled
        style={{ backgroundColor: "transparent" }}
        tabStyle={{ width: "auto", padding: 0 }}
        indicatorStyle={{ backgroundColor: "#0891B2" }}
        activeColor="#0891B2"
        inactiveColor="#666666"
        labelStyle={{ fontSize: 14 }}
        gap={8}
      />
    </ScrollView>
  );

  if (vm.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pb-20">
        <ScreenHeader
          title="Perfil da Empresa"
          subtitle="Gerencie as informações do perfil da sua empresa"
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => vm.setActiveTab(routes[index].key as any)}
          renderTabBar={renderTabBar}
          initialLayout={{ width: layout.width }}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
