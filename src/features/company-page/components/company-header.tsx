// Path: src/features/company-page/components/company-header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import { Info, Store, MessageCircle } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CompanyHeaderProps {
  onMoreInfoPress?: () => void;
}

export function CompanyHeader({ onMoreInfoPress }: CompanyHeaderProps) {
  const vm = useCompanyPageContext();
  const insets = useSafeAreaInsets();

  if (!vm.profile) return null;

  // Handler para WhatsApp
  const handleWhatsApp = async () => {
    const whatsappLink = vm.getWhatsAppLink();
    if (whatsappLink) {
      await Linking.openURL(whatsappLink);
    }
  };

  // Verificar se o estabelecimento está aberto
  const isOpen = () => {
    if (!vm.profile?.dias_funcionamento) return false;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 6 = Sábado
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Mapear o dia da semana em JavaScript para o formato usado na API
    const dayMapping = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const dayKey = dayMapping[currentDay];

    // Verificar se o dia atual está na lista de dias de funcionamento
    if (!vm.profile.dias_funcionamento.includes(dayKey)) {
      return false;
    }

    // Obter o horário de abertura e fechamento para o dia atual
    const openTimeKey = `abertura_${dayKey}`;
    const closeTimeKey = `fechamento_${dayKey}`;

    const openTimeString = vm.profile[
      openTimeKey as keyof typeof vm.profile
    ] as string | undefined;
    const closeTimeString = vm.profile[
      closeTimeKey as keyof typeof vm.profile
    ] as string | undefined;

    if (!openTimeString || !closeTimeString) {
      return false;
    }

    // Converter os horários para minutos a partir de meia-noite
    function timeStringToMinutes(timeString: string): number {
      // Exemplo: "09:00:00" -> 540 minutos (9 horas * 60)
      const parts = timeString.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      return hours * 60 + minutes;
    }

    const openTimeMinutes = timeStringToMinutes(openTimeString);
    const closeTimeMinutes = timeStringToMinutes(closeTimeString);

    // Verificar se o horário atual está dentro do horário de funcionamento
    return (
      currentTimeInMinutes >= openTimeMinutes &&
      currentTimeInMinutes <= closeTimeMinutes
    );
  };

  // Definir estilos baseados na cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";
  const open = isOpen();
  const statusColor = open ? "#22C55E" : "#EF4444"; // Verde se aberto, vermelho se fechado
  const statusText = open ? "Aberto agora" : "Fechado";

  return (
    <View className="relative mb-4">
      {/* Banner */}
      <View className="w-full relative overflow-hidden" style={{ height: 180 }}>
        <ImagePreview
          uri={vm.profile.banner}
          fallbackIcon={Store}
          width="100%"
          height="100%"
          resizeMode="cover"
          containerClassName={vm.profile.banner ? "" : "bg-gray-100"}
        />

        {/* Gradiente para melhorar legibilidade do conteúdo */}
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
      </View>

      {/* Indicador de aberto/fechado */}
      <View
        className="absolute top-4 right-4 px-3 py-1 rounded-full flex-row items-center"
        style={{
          backgroundColor: `${statusColor}20`,
        }}
      >
        <View
          className="w-2 h-2 rounded-full mr-1"
          style={{ backgroundColor: statusColor }}
        />
        <Text style={{ color: statusColor }} className="font-medium">
          {statusText}
        </Text>
      </View>

      {/* Conteúdo principal */}
      <View className="px-4 -mt-16 relative z-10">
        <Card className="p-4 rounded-xl">
          <HStack space="lg" alignItems="flex-start">
            {/* Logo */}
            <View className="w-20 h-20 rounded-xl border-2 border-white overflow-hidden bg-white">
              <ImagePreview
                uri={vm.profile.logo}
                fallbackIcon={Store}
                width="100%"
                height="100%"
                containerClassName="bg-gray-100"
              />
            </View>

            {/* Informações da empresa */}
            <VStack className="flex-1">
              <Text className="text-xl font-semibold text-gray-800">
                {vm.profile.nome}
              </Text>

              {vm.profile.empresa?.categoria && (
                <Text className="text-sm text-gray-600 mb-1">
                  {vm.profile.empresa.categoria.nome}
                </Text>
              )}

              <View className="flex-row flex-wrap gap-1 mt-1">
                {vm.profile.empresa?.subcategorias?.map((sub) => (
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
            </VStack>
          </HStack>

          {/* Botões de ação */}
          <View className="flex-row mt-4 gap-2">
            {/* WhatsApp (apenas se disponível) */}
            {vm.profile.whatsapp && (
              <TouchableOpacity
                onPress={handleWhatsApp}
                className="flex-1 py-3 bg-green-500 rounded-lg flex-row justify-center items-center"
              >
                <MessageCircle size={18} color="white" />
                <Text className="ml-2 font-medium text-white">WhatsApp</Text>
              </TouchableOpacity>
            )}

            {/* Mais informações */}
            <TouchableOpacity
              onPress={onMoreInfoPress}
              className="flex-1 py-3 bg-gray-50 rounded-lg flex-row justify-center items-center"
            >
              <Info size={18} color={primaryColor} />
              <Text
                className="ml-2 font-medium"
                style={{ color: primaryColor }}
              >
                Informações
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </View>
  );
}
