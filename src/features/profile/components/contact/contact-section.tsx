// Path: src/features/profile/components/contact/contact-section.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import {
  Edit3,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react-native";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ContactForm } from "./contact-form";
import { Section } from "@/components/custom/section";
import { THEME_COLORS } from "@/src/styles/colors";

export function ContactSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const contactItems = [
    {
      icon: MapPin,
      label: "Endereço",
      value: vm.profile.endereco,
      color: "#3B82F6", // blue
      action: vm.profile.endereco
        ? () =>
            Linking.openURL(
              `https://maps.google.com/?q=${encodeURIComponent(
                vm.profile?.endereco || ""
              )}`
            )
        : undefined,
    },
    {
      icon: Phone,
      label: "Telefone",
      value: vm.profile.telefone,
      color: "#10B981", // green
      action: vm.profile.telefone
        ? () => vm.profile && Linking.openURL(`tel:${vm.profile.telefone}`)
        : undefined,
    },
    {
      icon: MessageSquare,
      label: "WhatsApp",
      value: vm.profile.whatsapp,
      isOptional: true,
      color: "#10B981", // green
      action: vm.profile.whatsapp
        ? () =>
            Linking.openURL(
              `https://wa.me/${vm.profile?.whatsapp.replace(/\D/g, "")}`
            )
        : undefined,
    },
    {
      icon: Mail,
      label: "Email",
      value: vm.profile.email,
      color: "#F59E0B", // amber
      action: vm.profile.email
        ? () => vm.profile && Linking.openURL(`mailto:${vm.profile.email}`)
        : undefined,
    },
  ];

  return (
    <View>
      <Section
        title="Informações de Contato"
        icon={<Phone size={22} color={THEME_COLORS.secondary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsContactInfoOpen(true)}
      >
        <View className="gap-3">
          {contactItems.map((item) => (
            <View
              key={item.label}
              className="bg-white rounded-md p-4 flex-row items-center gap-2 border border-gray-100"
            >
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                <item.icon size={20} color={item.color} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  {item.label}
                </Text>
                {item.value ? (
                  <View className="flex-row items-center mt-1">
                    <Text className="text-base text-gray-900 break-all">
                      {item.value}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-sm text-gray-500 italic mt-1">
                    {item.isOptional ? "Não informado" : "Não configurado"}
                  </Text>
                )}
              </View>

              {item.action && (
                <TouchableOpacity
                  onPress={item.action}
                  className="bg-gray-50 p-2 rounded-full"
                >
                  <ExternalLink size={18} color={item.color} />
                </TouchableOpacity>
              )}
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
