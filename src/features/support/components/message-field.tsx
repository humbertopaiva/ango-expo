// Path: src/features/support/components/message-field.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Send } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface MessageFieldProps {
  message: string;
  onChangeMessage: (text: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
}

export function MessageField({
  message,
  onChangeMessage,
  onSendMessage,
  isLoading = false,
}: MessageFieldProps) {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        Enviar Mensagem
      </Text>
      <Text className="text-sm text-gray-600 mb-3">
        Utilize o campo abaixo para enviar uma mensagem diretamente para o nosso
        suporte via WhatsApp.
      </Text>

      <TextInput
        value={message}
        onChangeText={onChangeMessage}
        multiline
        className="border border-gray-200 rounded-lg p-3 min-h-[100px] text-gray-700 mb-4"
        placeholder="Digite sua mensagem aqui..."
        textAlignVertical="top"
      />

      <TouchableOpacity
        onPress={onSendMessage}
        className="flex-row items-center justify-center py-3 rounded-lg"
        style={{ backgroundColor: THEME_COLORS.primary }}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Send size={18} color="white" />
        <Text className="text-white font-medium ml-2">Enviar no WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}
