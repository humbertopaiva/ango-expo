// Path: src/features/delivery/components/delivery-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  MessageCircle,
  Phone,
  MapPin,
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
  try {
    // Verificações de segurança para garantir que profile é um objeto válido
    if (!profile || typeof profile !== "object") {
      console.error("Invalid profile data:", profile);
      return null;
    }

    // Verificações de segurança para empresa e subcategorias
    const empresa = profile.empresa || {};
    const subcategories = Array.isArray(empresa.subcategorias)
      ? empresa.subcategorias
      : [];

    // Verificação segura se está aberto
    let isOpen = false;
    try {
      isOpen = checkIfOpen(profile);
    } catch (error) {
      console.error("Error checking if open:", error);
    }

    const handleWhatsAppClick = (e: any) => {
      try {
        e.stopPropagation();
        e.preventDefault();
        if (profile.whatsapp) {
          const phoneNumber = profile.whatsapp.replace(/\D/g, "");
          const whatsappUrl = `https://wa.me/${phoneNumber}`;
          window.open(whatsappUrl, "_blank");
        }
      } catch (error) {
        console.error("Error with WhatsApp click:", error);
      }
    };

    const handlePhoneClick = (e: any) => {
      try {
        e.stopPropagation();
        e.preventDefault();
        if (profile.whatsapp) {
          const phoneNumber = profile.whatsapp.replace(/\D/g, "");
          const telUrl = `tel:${phoneNumber}`;
          window.open(telUrl, "_blank");
        }
      } catch (error) {
        console.error("Error with phone click:", error);
      }
    };

    const navigateToCompany = () => {
      try {
        if (empresa.slug) {
          router.push(`/(drawer)/empresa/${empresa.slug}`);
        }
      } catch (error) {
        console.error("Error navigating to company:", error);
      }
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
                      {profile.nome && typeof profile.nome === "string"
                        ? profile.nome.charAt(0)
                        : "?"}
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
            <Text className="text-lg font-semibold mb-2">
              {profile.nome || "Sem nome"}
            </Text>

            <View className="flex-row flex-wrap mb-3">
              {subcategories.length > 0 && (
                <>
                  {subcategories.slice(0, 2).map((sub, index) => {
                    if (!sub || !sub.subcategorias_empresas_id) return null;

                    return (
                      <View
                        key={
                          sub.subcategorias_empresas_id.id ||
                          `subcategory-${index}`
                        }
                        className="mr-1 mb-1"
                      >
                        <StatusBadge
                          status="info"
                          customLabel={
                            sub.subcategorias_empresas_id.nome || "Categoria"
                          }
                          className="bg-primary-50"
                          textClassName="text-primary-800"
                        />
                      </View>
                    );
                  })}

                  {subcategories.length > 2 && (
                    <StatusBadge
                      status="info"
                      customLabel={`+${subcategories.length - 2}`}
                      className="bg-gray-100"
                      textClassName="text-gray-700"
                    />
                  )}
                </>
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

              {profile.whatsapp && (
                <>
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
                </>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  } catch (error) {
    console.error("Error rendering DeliveryCard:", error);
    return null;
  }
}
