// Path: src/features/profile/components/social/social-section.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Edit3, ExternalLink, Share2 } from "lucide-react-native";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react-native";

import { useProfileContext } from "../../contexts/use-profile-context";
import { SocialForm } from "./social-form";
import { Section } from "@/components/custom/section";
import { extractUsername, SocialNetwork } from "@/src/utils/social.utils";
import { THEME_COLORS } from "@/src/styles/colors";

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
      icon: Youtube,
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

  const hasSocialNetworks = socialNetworks.some((network) => !!network.value);

  return (
    <View>
      <Section
        title="Redes Sociais"
        icon={<Share2 size={22} color={THEME_COLORS.secondary} />}
        actionIcon={<Edit3 size={18} color="#FFFFFF" />}
        onAction={() => vm.setIsSocialLinksOpen(true)}
      >
        <View className="gap-3">
          {socialNetworks.map((network) => (
            <View
              key={network.name}
              className="bg-white rounded-md p-4 flex-row items-center gap-3 border border-gray-100"
            >
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                <network.icon size={20} color={network.color} />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700">
                  {network.name}
                </Text>

                {network.value ? (
                  <View className="flex-row items-center mt-1">
                    <Text className="text-base text-gray-900">
                      {network.username}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-sm text-gray-500 italic mt-1">
                    Não configurado
                  </Text>
                )}
              </View>

              {network.value && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(network.value || "")}
                  className="bg-gray-50 p-2 rounded-full"
                >
                  <ExternalLink size={18} color={network.color} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </Section>

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
