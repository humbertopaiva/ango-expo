import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Building2,
  Phone,
  Share2,
  Clock,
  Palette,
  CreditCard,
  Edit3,
} from "lucide-react-native";
import { BasicInfoSection } from "../components/basic-info/basic-info-section";
import { ContactSection } from "../components/contact/contact-section";
import { SocialSection } from "../components/social/social-section";
import { HoursSection } from "../components/hours/hours-section";
import { VisualSection } from "../components/visual/visual-section";
import { PaymentSection } from "../components/payment/payment-section";
import { Text } from "@/components/ui/text";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { useProfileContext } from "../contexts/use-profile-context";

export function ProfileContent() {
  const vm = useProfileContext();
  type SectionKey = keyof typeof sectionConfig;
  const [activeSection, setActiveSection] = useState<SectionKey>("basic");

  // Mapeamento das seções com seus respectivos handlers de edição
  const sectionConfig = {
    basic: {
      key: "basic",
      title: "Info Básica",
      icon: Building2,
      component: BasicInfoSection,
      action: () => vm.setIsBasicInfoOpen(true),
      actionLabel: "Editar Informações Básicas",
    },
    contact: {
      key: "contact",
      title: "Contato",
      icon: Phone,
      component: ContactSection,
      action: () => vm.setIsContactInfoOpen(true),
      actionLabel: "Editar Contato",
    },
    social: {
      key: "social",
      title: "Redes Sociais",
      icon: Share2,
      component: SocialSection,
      action: () => vm.setIsSocialLinksOpen(true),
      actionLabel: "Editar Redes Sociais",
    },
    hours: {
      key: "hours",
      title: "Horários",
      icon: Clock,
      component: HoursSection,
      action: () => vm.setIsHoursOpen(true),
      actionLabel: "Editar Horários",
    },
    visual: {
      key: "visual",
      title: "Visual",
      icon: Palette,
      component: VisualSection,
      action: () => vm.setIsVisualOpen(true),
      actionLabel: "Editar Visual",
    },
    payment: {
      key: "payment",
      title: "Pagamento",
      icon: CreditCard,
      component: PaymentSection,
      action: () => vm.setIsPaymentOpen(true),
      actionLabel: "Editar Pagamento",
    },
  };

  const sections = Object.values(sectionConfig);

  const activeConfig = sectionConfig[activeSection] || sectionConfig.basic;
  const ActiveSectionComponent = activeConfig.component;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
              onPress={() => setActiveSection(section.key as SectionKey)}
              className={`flex-row items-center px-4 py-2 mx-1 rounded-full border ${
                activeSection === section.key
                  ? "bg-primary-500 border-primary-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <section.icon
                size={16}
                color={activeSection === section.key ? "#FFFFFF" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-md font-semibold ${
                  activeSection === section.key
                    ? "text-white "
                    : "text-gray-600"
                }`}
              >
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ActiveSectionComponent />
        </ScrollView>
        <PrimaryActionButton
          onPress={activeConfig.action}
          label={activeConfig.actionLabel}
          icon={<Edit3 size={20} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}
