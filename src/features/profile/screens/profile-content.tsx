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
} from "lucide-react-native";
import { BasicInfoSection } from "../components/basic-info/basic-info-section";
import { ContactSection } from "../components/contact/contact-section";
import { SocialSection } from "../components/social/social-section";
import { HoursSection } from "../components/hours/hours-section";
import { VisualSection } from "../components/visual/visual-section";
import { PaymentSection } from "../components/payment/payment-section";
import { Text } from "@/components/ui/text";

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
];

export function ProfileContent() {
  const [activeSection, setActiveSection] = useState("basic");
  const ActiveSectionComponent =
    sections.find((s) => s.key === activeSection)?.component ||
    BasicInfoSection;

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
              onPress={() => setActiveSection(section.key)}
              className={`flex-row items-center px-3 py-1 mx-1 rounded-full border ${
                activeSection === section.key
                  ? "bg-primary-100 border-primary-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <section.icon
                size={16}
                color={activeSection === section.key ? "#0891B2" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm ${
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
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <ActiveSectionComponent />
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
