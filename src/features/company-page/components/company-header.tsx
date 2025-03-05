// src/features/company-page/components/company-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform, Linking } from "react-native";
import { Phone, Mail, MapPin, Clock, Store } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Button, ButtonText } from "@/components/ui/button";

export function CompanyHeader() {
  const vm = useCompanyPageContext();

  if (!vm.profile) return null;

  const handleWhatsApp = async () => {
    const whatsappLink = vm.getWhatsAppLink();
    if (whatsappLink) {
      await Linking.openURL(whatsappLink);
    }
  };

  return (
    <View className="relative">
      {/* Banner */}
      <View className="h-48 w-full relative overflow-hidden">
        <ImagePreview
          uri={vm.profile.banner}
          fallbackIcon={Store}
          width="100%"
          height="100%"
          resizeMode="cover"
          containerClassName={vm.profile.banner ? "" : "bg-primary-100"}
        />
      </View>

      {/* Company Info Card */}
      <Card className="mx-4 -mt-24 relative z-10">
        <View className="p-4">
          {/* Logo and Name */}
          <View className="flex-row items-center gap-4">
            <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
              <ImagePreview
                uri={vm.profile.logo}
                fallbackIcon={Store}
                width="100%"
                height="100%"
                containerClassName="bg-gray-100"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold">{vm.profile.nome}</Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                {vm.profile.empresa.subcategorias.map((sub) => (
                  <View
                    key={sub.subcategorias_empresas_id.id}
                    className="px-2 py-0.5 bg-gray-100 rounded-full"
                  >
                    <Text className="text-xs text-gray-700">
                      {sub.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View className="mt-6 md:flex-row md:flex">
            <View className="space-y-2 mb-4 md:flex-1">
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-sm text-gray-700">
                  {vm.getFormattedAddress()}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm text-gray-700">
                  {vm.getFormattedWorkingHours()}
                </Text>
              </View>
            </View>
            <View className="space-y-2 mb-4 md:flex-1">
              {vm.profile.telefone && (
                <View className="flex-row items-center gap-2">
                  <Phone size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-700">
                    {vm.profile.telefone}
                  </Text>
                </View>
              )}
              {vm.profile.email && (
                <View className="flex-row items-center gap-2">
                  <Mail size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-700">
                    {vm.profile.email}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mt-4">
            <Button className="flex-1" onPress={handleWhatsApp}>
              <ButtonText>Contato via WhatsApp</ButtonText>
            </Button>
            {vm.hasDelivery() && (
              <Button variant="outline" className="flex-1">
                <ButtonText>Ver Cardápio</ButtonText>
              </Button>
            )}
          </View>
        </View>
      </Card>
    </View>
  );
}
