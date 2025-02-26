// src/features/profile/components/contact/contact-section.tsx
import React from "react";
import { View, Text } from "react-native";
import { Edit3, MapPin, Phone, Mail, MessageSquare } from "lucide-react-native";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ContactForm } from "./contact-form";
import { Section } from "@/components/custom/section";

export function ContactSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const contactItems = [
    {
      icon: MapPin,
      label: "Endereço",
      value: vm.profile.endereco,
      color: "#3B82F6", // blue
    },
    {
      icon: Phone,
      label: "Telefone",
      value: vm.profile.telefone,
      color: "#10B981", // green
    },
    {
      icon: MessageSquare,
      label: "WhatsApp",
      value: vm.profile.whatsapp,
      isOptional: true,
      color: "#10B981", // green
    },
    {
      icon: Mail,
      label: "Email",
      value: vm.profile.email,
      color: "#F59E0B", // amber
    },
  ];

  return (
    <View>
      <Section
        title="Informações de Contato"
        icon={<Phone size={22} color="#0891B2" />}
        actionIcon={<Edit3 size={16} color="#374151" />}
        onAction={() => vm.setIsContactInfoOpen(true)}
      >
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactItems.map((item) => (
            <View
              key={item.label}
              className="flex-row gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
            >
              <View className="mt-1">
                <item.icon size={20} color={item.color} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  {item.label}
                </Text>
                {item.value ? (
                  <Text className="text-base text-gray-900 break-all mt-1">
                    {item.value}
                  </Text>
                ) : (
                  <Text className="text-sm text-gray-500 italic mt-1">
                    {item.isOptional ? "Não informado" : "Não configurado"}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </Section>

      <ContactForm
        open={vm.isContactInfoOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateContactInfo}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
