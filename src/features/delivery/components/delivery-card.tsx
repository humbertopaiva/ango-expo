// Path: src/features/delivery/components/delivery-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { DeliveryProfile } from "../models/delivery-profile";

import { router } from "expo-router";
import { StatusBadge } from "@/components/custom/status-badge";
import { THEME_COLORS } from "@/src/styles/colors";
import { checkIfOpen } from "../hooks/use-delivery-page";

interface DeliveryCardProps {
  profile: DeliveryProfile;
}

export function DeliveryCard({ profile }: DeliveryCardProps) {
  const isOpen = checkIfOpen(profile);

  const handleWhatsAppClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (profile.whatsapp) {
      const phoneNumber = profile.whatsapp.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handlePhoneClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (profile.whatsapp) {
      const phoneNumber = profile.whatsapp.replace(/\D/g, "");
      const telUrl = `tel:${phoneNumber}`;
      window.open(telUrl, "_blank");
    }
  };

  const navigateToCompany = () => {
    router.push(`/(drawer)/empresa/${profile.empresa.slug}`);
  };

  return (
    <TouchableOpacity
      onPress={navigateToCompany}
      activeOpacity={0.7}
      className="h-full"
    >
      <Card className="overflow-hidden border border-gray-200 h-full">
        <View className="relative h-36">
          {profile.banner ? (
            <ImagePreview
              uri={profile.banner}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-primary-50">
              <Package size={48} color={THEME_COLORS.primary} />
            </View>
          )}
          <View className="absolute left-3 -bottom-6">
            <View className="w-16 h-16 rounded-full overflow-hidden border-4 border-white bg-white">
              {profile.logo ? (
                <ImagePreview
                  uri={profile.logo}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-gray-100">
                  <Text className="text-xl font-bold text-primary-600">
                    {profile.nome.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="absolute top-2 right-2">
            <StatusBadge
              status={isOpen ? "aberto" : "fechado"}
              customLabel={isOpen ? "Aberto agora" : "Fechado"}
              className={isOpen ? "bg-green-100" : "bg-red-100"}
              textClassName={isOpen ? "text-green-800" : "text-red-800"}
            />
          </View>
        </View>

        <View className="p-4 pt-8">
          <Text className="text-lg font-semibold mb-2">{profile.nome}</Text>

          <View className="flex-row flex-wrap mb-3">
            {profile.empresa.subcategorias.slice(0, 2).map((sub) => (
              <View
                key={sub.subcategorias_empresas_id.id}
                className="mr-1 mb-1"
              >
                <StatusBadge
                  status="info"
                  customLabel={sub.subcategorias_empresas_id.nome}
                  className="bg-primary-50"
                  textClassName="text-primary-800"
                />
              </View>
            ))}

            {profile.empresa.subcategorias.length > 2 && (
              <StatusBadge
                status="info"
                customLabel={`+${profile.empresa.subcategorias.length - 2}`}
                className="bg-gray-100"
                textClassName="text-gray-700"
              />
            )}
          </View>

          {profile.endereco && (
            <View className="flex-row items-center mb-4">
              <MapPin size={14} color="#6B7280" className="mr-1" />
              <Text className="text-sm text-gray-600" numberOfLines={1}>
                {profile.endereco}
              </Text>
            </View>
          )}

          <View className="flex-row mt-2">
            <TouchableOpacity
              onPress={navigateToCompany}
              className="bg-primary flex-1 h-10 rounded-lg items-center justify-center flex-row mr-2"
            >
              <Text className="text-white font-medium">Ver cardápio</Text>
              <ChevronRight size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePhoneClick}
              className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center mr-2"
            >
              <Phone size={18} color={THEME_COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWhatsAppClick}
              className="w-10 h-10 rounded-lg bg-green-50 items-center justify-center"
            >
              <MessageCircle size={18} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
