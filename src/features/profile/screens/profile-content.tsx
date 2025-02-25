// src/features/profile/screens/profile-content.tsx
import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Building2,
  Phone,
  Share2,
  Clock,
  Palette,
  CreditCard,
  Tag,
} from "lucide-react-native";

import ScreenHeader from "@/components/ui/screen-header";
import { BasicInfoSection } from "../components/basic-info/basic-info-section";
import { ContactSection } from "../components/contact/contact-section";
import { SocialSection } from "../components/social/social-section";
import { HoursSection } from "../components/hours/hours-section";
import { VisualSection } from "../components/visual/visual-section";
import { PaymentSection } from "../components/payment/payment-section";
import { AdditionalSection } from "../components/additional/additional-section";
import { useProfileContext } from "../contexts/use-profile-context";
import { Text } from "@/components/ui/text";

// Definição das seções de perfil
const sections = [
  {
    key: "basic",
    title: "Info Básica",
    icon: Building2,
    component: BasicInfoSection,
  },
  { key: "contact", title: "Contato", icon: Phone, component: ContactSection },
  {
    key: "social",
    title: "Redes Sociais",
    icon: Share2,
    component: SocialSection,
  },
  { key: "hours", title: "Horários", icon: Clock, component: HoursSection },
  { key: "visual", title: "Visual", icon: Palette, component: VisualSection },
  {
    key: "payment",
    title: "Pagamento",
    icon: CreditCard,
    component: PaymentSection,
  },
  {
    key: "additional",
    title: "Adicional",
    icon: Tag,
    component: AdditionalSection,
  },
];

export function ProfileContent() {
  const vm = useProfileContext();
  const [activeSection, setActiveSection] = useState("basic");
  const scrollRef = useRef<ScrollView>(null);

  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey);
    vm.setActiveTab(sectionKey as any);

    // Rolar para o topo quando mudar de seção
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Encontrar o componente da seção ativa
  const ActiveSectionComponent =
    sections.find((s) => s.key === activeSection)?.component ||
    BasicInfoSection;

  if (vm.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0891B2" />
          <Text className="mt-4 text-gray-500">Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Menu de navegação horizontal com scroll */}
      <View className="bg-white shadow-sm">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          className="py-4"
        >
          {sections.map((section) => (
            <TouchableOpacity
              key={section.key}
              onPress={() => handleSectionChange(section.key)}
              className={`flex-row items-center px-4 py-2 mx-1 rounded-full ${
                activeSection === section.key
                  ? "bg-primary-100 border border-primary-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <section.icon
                size={18}
                color={activeSection === section.key ? "#0891B2" : "#6B7280"}
              />
              <Text
                className={`ml-2 ${
                  activeSection === section.key
                    ? "text-primary-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Conteúdo da seção ativa sem animação e sem formato de card */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <ActiveSectionComponent />

        {/* Espaço para evitar conteúdo ficar escondido atrás da navigation bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
