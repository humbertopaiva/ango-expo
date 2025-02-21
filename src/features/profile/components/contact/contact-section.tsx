import React from "react";
import { View, Text } from "react-native";
import { Edit3, MapPin, Phone, Mail, MessageSquare } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";

import { useProfileContext } from "../../contexts/use-profile-context";
import { ContactForm } from "./contact-form";

export function ContactSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const contactItems = [
    {
      icon: MapPin,
      label: "Endereço",
      value: vm.profile.endereco,
    },
    {
      icon: Phone,
      label: "Telefone",
      value: vm.profile.telefone,
    },
    {
      icon: MessageSquare,
      label: "WhatsApp",
      value: vm.profile.whatsapp,
      isOptional: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: vm.profile.email,
    },
  ];

  return (
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">
              Informações de Contato
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsContactInfoOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactItems.map((item) => (
              <View
                key={item.label}
                className="flex-row items-start space-x-3 p-4 rounded-lg border bg-card"
              >
                <item.icon size={20} color="#6B7280" />
                <View className="space-y-1">
                  <Text className="text-sm font-medium">{item.label}</Text>
                  {item.value ? (
                    <Text className="text-sm text-gray-500 break-all">
                      {item.value}
                    </Text>
                  ) : (
                    <Text className="text-sm text-gray-500 italic">
                      {item.isOptional ? "Não informado" : "Não configurado"}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>

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
