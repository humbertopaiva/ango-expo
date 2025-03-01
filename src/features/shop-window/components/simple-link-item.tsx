// Path: src/features/shop-window/components/simple-link-item.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  Link as LinkIcon,
  Globe,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react-native";
import { VitrineLink } from "../models";

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
      case "site":
        return <Globe size={20} color="#0891B2" />;
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
      case "site":
        return "bg-primary-50";
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

  return (
    <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden mb-3">
      {/* Posição do item como "tag" no canto superior direito */}
      {!isReordering && position && (
        <View className="absolute top-0 right-0 bg-primary-100 rounded-bl-lg px-1.5 py-0.5 z-10">
          <Text className="text-xs font-bold text-primary-700">
            #{position}
          </Text>
        </View>
      )}

      <View className="p-2 flex-row">
        {/* Área de reordenação ou ícone do tipo de link */}
        <View className="pr-2">
          {isReordering ? (
            <View className="h-12 w-12 bg-gray-50 rounded-lg justify-center items-center">
              <View className="flex-row">
                {onMoveUp && (
                  <View
                    className="shadow-md"
                    style={[
                      styles.arrowButton,
                      !onMoveUp && styles.disabledButton,
                    ]}
                    onTouchEnd={onMoveUp}
                  >
                    <ArrowUp
                      size={16}
                      color={
                        onMoveUp !== undefined
                          ? "#F4511E"
                          : "rgba(244, 81, 30, 0.4)"
                      }
                    />
                  </View>
                )}
                {onMoveDown && (
                  <View
                    style={[
                      styles.arrowButton,
                      { marginLeft: 4 },
                      !onMoveDown && styles.disabledButton,
                    ]}
                    onTouchEnd={onMoveDown}
                  >
                    <ArrowDown
                      size={16}
                      color={
                        onMoveDown !== undefined
                          ? "#F4511E"
                          : "rgba(244, 81, 30, 0.4)"
                      }
                    />
                  </View>
                )}
              </View>
            </View>
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
                {link.tipo_link.charAt(0).toUpperCase() +
                  link.tipo_link.slice(1)}
              </Text>
            </View>
          </View>

          {/* Texto do link */}
          <Text className="font-medium text-sm" numberOfLines={1}>
            {link.texto}
          </Text>

          {/* URL com ícone de link externo */}
          <View
            className="flex-row items-center mt-0.5 bg-gray-50 self-start px-1.5 py-0.5 rounded-md"
            onTouchEnd={() => {
              // Adicionamos apenas um manipulador vazio para mostrar feedback de toque
            }}
          >
            <Text className="text-xs text-gray-500 mr-1">
              {formatUrl(link.url)}
            </Text>
            <ExternalLink size={10} color="#6B7280" />
          </View>
        </View>

        {/* Botões de ação */}
        {!isReordering && (
          <View className="flex-row">
            <View style={styles.actionButton} onTouchEnd={() => onEdit(link)}>
              <Edit size={20} color="#374151" />
            </View>
            <View
              style={[styles.actionButton, { backgroundColor: "#FEE2E2" }]}
              onTouchEnd={() => onDelete(link)}
            >
              <Trash size={20} color="#EF4444" />
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.4,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
