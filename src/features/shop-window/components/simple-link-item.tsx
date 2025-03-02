// Path: src/features/shop-window/components/simple-link-item.tsx
import React from "react";
import { View, Text, Linking } from "react-native";
import {
  ExternalLink,
  Link as LinkIcon,
  Globe,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Video,
  Send,
  MapPin,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Phone,
} from "lucide-react-native";
import { VitrineLink } from "../models";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { ReorderButtons } from "@/components/common/reorder-buttons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface SimpleLinkItemProps {
  link: VitrineLink;
  onEdit: (link: VitrineLink) => void;
  onDelete: (link: VitrineLink) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SimpleLinkItem({
  link,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SimpleLinkItemProps) {
  // Função para obter ícone baseado no tipo de link
  const getLinkIcon = () => {
    switch (link.tipo_link) {
      case "whatsapp":
        return <MessageCircle size={20} color="#25D366" />;
      case "instagram":
        return <Instagram size={20} color="#E1306C" />;
      case "facebook":
        return <Facebook size={20} color="#1877F2" />;
      case "tiktok":
        return <Video size={20} color="#000000" />;
      case "youtube":
        return <Video size={20} color="#FF0000" />;
      case "twitter":
        return <Twitter size={20} color="#1DA1F2" />;
      case "telegram":
        return <Send size={20} color="#0088CC" />;
      case "shopee":
        return <ShoppingBag size={20} color="#EE4D2D" />;
      case "mercado_livre":
        return <ShoppingCart size={20} color="#FFE600" />;
      case "catalogo_pdf":
        return <FileText size={20} color="#F40F02" />;
      case "google_maps":
        return <MapPin size={20} color="#4285F4" />;
      case "site":
        return <Globe size={20} color="#0891B2" />;
      case "telefone":
        return <Phone size={20} color="#0CA789" />;
      default:
        return <LinkIcon size={20} color="#6B7280" />;
    }
  };

  // Função para obter cor de fundo baseada no tipo de link
  const getLinkBgColor = () => {
    switch (link.tipo_link) {
      case "whatsapp":
        return "bg-green-50";
      case "instagram":
        return "bg-pink-50";
      case "facebook":
        return "bg-blue-50";
      case "tiktok":
        return "bg-gray-50";
      case "youtube":
        return "bg-red-50";
      case "twitter":
        return "bg-blue-50";
      case "telegram":
        return "bg-blue-50";
      case "shopee":
        return "bg-orange-50";
      case "mercado_livre":
        return "bg-yellow-50";
      case "catalogo_pdf":
        return "bg-red-50";
      case "google_maps":
        return "bg-blue-50";
      case "site":
        return "bg-primary-50";
      case "telefone":
        return "bg-emerald-50";
      default:
        return "bg-gray-50";
    }
  };

  // Formato de texto para URL truncada
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname +
        (urlObj.pathname !== "/"
          ? urlObj.pathname.substring(0, 15) +
            (urlObj.pathname.length > 15 ? "..." : "")
          : "")
      );
    } catch {
      return url.length > 25 ? url.substring(0, 25) + "..." : url;
    }
  };

  const handleOpenUrl = async () => {
    try {
      if (await Linking.canOpenURL(link.url)) {
        await Linking.openURL(link.url);
      } else {
        console.warn("Não foi possível abrir a URL:", link.url);
      }
    } catch (error) {
      console.error("Erro ao abrir URL:", error);
    }
  };

  const renderLinkContent = () => (
    <View className="p-2 flex-row">
      {/* Área de reordenação ou ícone do tipo de link */}
      <View className="pr-2">
        {isReordering ? (
          <ReorderButtons onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        ) : (
          <View
            className={`h-12 w-12 rounded-lg items-center justify-center ${getLinkBgColor()}`}
          >
            {getLinkIcon()}
          </View>
        )}
      </View>

      {/* Informações do link */}
      <View className="flex-1">
        {/* Tipo de link como tag */}
        <View className="flex-row mb-0.5">
          <View className={`px-1.5 py-0.5 rounded-full ${getLinkBgColor()}`}>
            <Text className="text-xs">
              {link.tipo_link.charAt(0).toUpperCase() + link.tipo_link.slice(1)}
            </Text>
          </View>
        </View>

        {/* Texto do link */}
        <Text className="font-medium text-sm" numberOfLines={1}>
          {link.texto}
        </Text>

        {/* URL com ícone de link externo */}
        <TouchableOpacity
          onPress={handleOpenUrl}
          className="flex-row items-center mt-0.5 bg-gray-50 self-start px-1.5 py-0.5 rounded-md"
        >
          <Text className="text-xs text-gray-500 mr-1">
            {formatUrl(link.url)}
          </Text>
          <ExternalLink size={10} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Durante a reordenação, desative o swipe
  if (isReordering) {
    return <View className="mb-3">{renderLinkContent()}</View>;
  }

  // Caso contrário, use o SwipeableCard
  return (
    <SwipeableCard
      onEdit={() => onEdit(link)}
      onDelete={() => onDelete(link)}
      position={position}
      badgeColor="bg-primary-100"
    >
      {renderLinkContent()}
    </SwipeableCard>
  );
}
