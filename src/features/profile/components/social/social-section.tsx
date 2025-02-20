import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { Edit3, ExternalLink } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";

import { useProfileContext } from "../../contexts/use-profile-context";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react-native";
import { extractUsername, SocialNetwork } from "@/src/utils/social.utils";
import { SocialForm } from "./social-form";

export function SocialSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  const socialNetworks = [
    {
      name: "Instagram",
      icon: Instagram,
      value: vm.profile.instagram,
      username: extractUsername("instagram", vm.profile.instagram || ""),
      color: "#E1306C",
      network: "instagram" as SocialNetwork,
    },
    {
      name: "Facebook",
      icon: Facebook,
      value: vm.profile.facebook,
      username: extractUsername("facebook", vm.profile.facebook || ""),
      color: "#1877F2",
      network: "facebook" as SocialNetwork,
    },
    {
      name: "TikTok",
      icon: Youtube, // TikTok icon não disponível no lucide-react-native
      value: vm.profile.tiktok,
      username: extractUsername("tiktok", vm.profile.tiktok || ""),
      color: "#000000",
      network: "tiktok" as SocialNetwork,
    },
    {
      name: "YouTube",
      icon: Youtube,
      value: vm.profile.youtube,
      username: extractUsername("youtube", vm.profile.youtube || ""),
      color: "#FF0000",
      network: "youtube" as SocialNetwork,
    },
    {
      name: "Twitter",
      icon: Twitter,
      value: vm.profile.twitter,
      username: extractUsername("twitter", vm.profile.twitter || ""),
      color: "#1DA1F2",
      network: "twitter" as SocialNetwork,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      value: vm.profile.linkedin,
      username: extractUsername("linkedin", vm.profile.linkedin || ""),
      color: "#0A66C2",
      network: "linkedin" as SocialNetwork,
    },
  ];

  return (
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Redes Sociais</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsSocialLinksOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialNetworks.map((network) => (
              <View
                key={network.name}
                className="flex-row items-center justify-between p-4 rounded-lg border bg-card"
              >
                <View className="flex-row items-center space-x-3">
                  <network.icon size={20} color={network.color} />
                  <View>
                    <Text className="font-medium">{network.name}</Text>
                    {network.value && (
                      <Text className="text-sm text-gray-500">
                        {network.username}
                      </Text>
                    )}
                  </View>
                </View>

                {network.value ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(network.value || "")}
                    className="flex-row items-center"
                  >
                    <Text className="text-sm text-primary-600 mr-1">
                      Visitar
                    </Text>
                    <ExternalLink size={16} color="#0891B2" />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-sm text-gray-500 italic">
                    Não configurado
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </Card>

      <SocialForm
        open={vm.isSocialLinksOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateSocialLinks}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
