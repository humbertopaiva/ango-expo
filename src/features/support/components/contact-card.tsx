// Path: src/features/support/components/contact-card.tsx
import React from "react";
import { View, Text } from "react-native";
import { HStack, VStack } from "@gluestack-ui/themed";
import { Phone, Mail, Clock } from "lucide-react-native";
import { SupportContact } from "../models/support";
import { THEME_COLORS } from "@/src/styles/colors";

interface ContactCardProps {
  contact: SupportContact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Fale Conosco
      </Text>

      <VStack space="md">
        <HStack space="md" alignItems="center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${THEME_COLORS.primary}15` }}
          >
            <Phone size={20} color={THEME_COLORS.primary} />
          </View>
          <VStack>
            <Text className="text-sm text-gray-500">WhatsApp</Text>
            <Text className="text-base font-medium text-gray-800">
              {formatPhone(contact.phone)}
            </Text>
          </VStack>
        </HStack>

        <HStack space="md" alignItems="center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${THEME_COLORS.primary}15` }}
          >
            <Mail size={20} color={THEME_COLORS.primary} />
          </View>
          <VStack>
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-base font-medium text-gray-800">
              {contact.email}
            </Text>
          </VStack>
        </HStack>

        {contact.hours && (
          <HStack space="md" alignItems="center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: `${THEME_COLORS.primary}15` }}
            >
              <Clock size={20} color={THEME_COLORS.primary} />
            </View>
            <VStack>
              <Text className="text-sm text-gray-500">
                Horário de Atendimento
              </Text>
              <Text className="text-base font-medium text-gray-800">
                {contact.hours}
              </Text>
            </VStack>
          </HStack>
        )}
      </VStack>
    </View>
  );
}

// Função para formatar número de telefone como (XX) XXXXX-XXXX
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      7
    )}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6, 10)}`;
  }

  return phone; // Retorna original se não conseguir formatar
}
