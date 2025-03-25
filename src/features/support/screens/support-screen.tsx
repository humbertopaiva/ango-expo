// Path: src/features/support/screens/support-screen.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { useSupportViewModel } from "../viewmodels/support-view-model";
import { ContactCard } from "../components/contact-card";
import { MessageField } from "../components/message-field";
import ScreenHeader from "@/components/ui/screen-header";
import { THEME_COLORS } from "@/src/styles/colors";

export function SupportScreen() {
  const { supportInfo, isLoading, message, setMessage, sendWhatsAppMessage } =
    useSupportViewModel();

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Suporte"
        subtitle="Fale com nossa equipe"
        variant="primary"
      />

      <ScrollView className="flex-1 p-4">
        {supportInfo && (
          <>
            <MessageField
              message={message}
              onChangeMessage={setMessage}
              onSendMessage={sendWhatsAppMessage}
              isLoading={isLoading}
            />

            <View className="h-4" />

            <ContactCard contact={supportInfo.contact} />
          </>
        )}

        {/* Espaço no final para melhor experiência de scroll */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
