import React from "react";
import { View, ScrollView } from "react-native";
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
  { key: "additional", title: "Adicional" },
];

export function ProfileContent() {
  const vm = useProfileContext();
  const isWeb = Platform.OS === "web";

  const renderScene = SceneMap({
    basic: BasicInfoSection,
    contact: ContactSection,
    social: SocialSection,
    hours: HoursSection,
    visual: VisualSection,
    payment: PaymentSection,
    additional: AdditionalSection,
  });

  if (vm.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const index = routes.findIndex((route) => route.key === vm.activeTab);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pb-20">
        {" "}
        {/* Adicionado pb-20 para dar espaço para a TabBar */}
        <ScreenHeader
          title="Perfil da Empresa"
          subtitle="Gerencie as informações do perfil da sua empresa"
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => vm.setActiveTab(routes[index].key as any)}
          renderTabBar={(props) => (
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
                renderLabel={({ route, focused }) => (
                  <Text
                    className={`px-4 py-2 text-sm ${
                      focused ? "text-primary-600" : "text-gray-600"
                    }`}
                  >
                    {route.title}
                  </Text>
                )}
              />
            </ScrollView>
          )}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
