// Path: src/features/company-page/components/-company-header.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Store,
  Instagram,
  Facebook,
  Mail,
  ExternalLink,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { formatSocialUrl } from "@/src/utils/social.utils";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Componente de cabeçalho aprimorado para a página da empresa
 * Inclui banner, logo, informações básicas e botões de contato
 */
export function CompanyHeader() {
  const vm = useCompanyPageContext();
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  if (!vm.profile) return null;

  // Função para verificar se o estabelecimento está aberto
  const isOpen = () => {
    if (!vm.profile?.horario_funcionamento) return false;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Tempo atual em minutos

    // Mapeamento dos dias da semana
    const dayMapping: Record<string, number> = {
      domingo: 0,
      segunda: 1,
      terca: 2,
      quarta: 3,
      quinta: 4,
      sexta: 5,
      sabado: 6,
    };

    // Verificar se o dia atual está entre os dias de funcionamento
    const isWorkingDay = vm.profile?.dias_funcionamento?.some(
      (dia) => dayMapping[dia.toLowerCase()] === currentDay
    );

    if (!isWorkingDay) return false;

    // Verificar se o horário atual está dentro do horário de funcionamento
    const horarios = vm.profile?.horario_funcionamento;
    if (!horarios || !horarios.abertura || !horarios.fechamento) return false;

    const [abreHora, abreMinuto] = horarios.abertura.split(":").map(Number);
    const [fechaHora, fechaMinuto] = horarios.fechamento.split(":").map(Number);

    const aberturaEmMinutos = abreHora * 60 + abreMinuto;
    const fechamentoEmMinutos = fechaHora * 60 + fechaMinuto;

    return (
      currentTime >= aberturaEmMinutos && currentTime < fechamentoEmMinutos
    );
  };

  const handlePhoneCall = async () => {
    if (vm.profile?.telefone) {
      const phoneNumber = vm.profile?.telefone.replace(/\D/g, "");
      const phoneUrl = `tel:${phoneNumber}`;
      await Linking.openURL(phoneUrl);
    }
  };

  const handleWhatsApp = async () => {
    const whatsappLink = vm.getWhatsAppLink();
    if (whatsappLink) {
      await Linking.openURL(whatsappLink);
    }
  };

  const handleSocialLink = async (socialType: string, url: string) => {
    if (!url) return;

    try {
      let formattedUrl = url;

      // Formatar a URL conforme o tipo de rede social
      if (socialType === "instagram") {
        formattedUrl = formatSocialUrl("instagram", url);
      } else if (socialType === "facebook") {
        formattedUrl = formatSocialUrl("facebook", url);
      }

      await Linking.openURL(formattedUrl);
    } catch (error) {
      console.error("Erro ao abrir link:", error);
    }
  };

  const handleEmailPress = async () => {
    if (vm.profile?.email) {
      await Linking.openURL(`mailto:${vm.profile.email}`);
    }
  };

  const handleMapPress = async () => {
    if (!vm.profile?.endereco) return;

    const address = encodeURIComponent(vm.profile.endereco);

    if (Platform.OS === "ios") {
      Linking.openURL(`maps://?q=${address}`);
    } else if (Platform.OS === "android") {
      Linking.openURL(`geo:0,0?q=${address}`);
    } else {
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  const renderSocialIcons = () => {
    const icons = [];

    if (vm.profile?.instagram) {
      icons.push(
        <TouchableOpacity
          key="instagram"
          onPress={() =>
            handleSocialLink("instagram", vm.profile?.instagram || "")
          }
          className="w-9 h-9 rounded-full bg-pink-100 items-center justify-center mr-2"
        >
          <Instagram size={18} color="#E1306C" />
        </TouchableOpacity>
      );
    }

    if (vm.profile?.facebook) {
      icons.push(
        <TouchableOpacity
          key="facebook"
          onPress={() =>
            handleSocialLink("facebook", vm.profile?.facebook || "")
          }
          className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-2"
        >
          <Facebook size={18} color="#1877F2" />
        </TouchableOpacity>
      );
    }

    if (vm.profile?.email) {
      icons.push(
        <TouchableOpacity
          key="email"
          onPress={handleEmailPress}
          className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-2"
        >
          <Mail size={18} color="#6B7280" />
        </TouchableOpacity>
      );
    }

    return icons;
  };

  // Definir estilos baseados na cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";
  const statusColor = isOpen() ? "#22C55E" : "#EF4444"; // Verde se aberto, vermelho se fechado
  const statusText = isOpen() ? "Aberto agora" : "Fechado";

  // Formatar horário de funcionamento
  const formatHorario = () => {
    if (!vm.profile?.horario_funcionamento) return "Horário não informado";

    const { abertura, fechamento } = vm.profile?.horario_funcionamento;
    if (!abertura || !fechamento) return "Horário não informado";

    return `${abertura} às ${fechamento}`;
  };

  return (
    <View className="relative mb-4">
      {/* Banner */}
      <View className="h-[180px] w-full relative overflow-hidden">
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
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 100,
          }}
        />
      </View>

      {/* Indicador de aberto/fechado */}
      <View
        className="absolute top-4 right-4 px-3 py-1 rounded-full flex-row items-center"
        style={{ backgroundColor: `${statusColor}20` }}
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
          <HStack className="mt-4 mb-1" space="md">
            {vm.profile.telefone && (
              <TouchableOpacity
                onPress={handlePhoneCall}
                className="flex-1 flex-row items-center justify-center py-2 px-3 bg-primary-50 rounded-lg"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Phone size={18} color={primaryColor} />
                <Text
                  className="ml-2 font-medium"
                  style={{ color: primaryColor }}
                >
                  Ligar
                </Text>
              </TouchableOpacity>
            )}

            {vm.profile.whatsapp && (
              <TouchableOpacity
                onPress={handleWhatsApp}
                className="flex-1 flex-row items-center justify-center py-2 px-3 bg-green-50 rounded-lg"
              >
                <MessageCircle size={18} color="#22C55E" />
                <Text className="ml-2 font-medium text-green-600">
                  WhatsApp
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setShowMoreInfo(!showMoreInfo)}
              className="flex-1 flex-row items-center justify-center py-2 px-3 bg-gray-100 rounded-lg"
            >
              {showMoreInfo ? (
                <ChevronUp size={18} color="#6B7280" />
              ) : (
                <ChevronDown size={18} color="#6B7280" />
              )}
              <Text className="ml-1 font-medium text-gray-700">
                {showMoreInfo ? "Menos" : "Mais"}
              </Text>
            </TouchableOpacity>
          </HStack>

          {/* Mais informações - Exibir apenas quando showMoreInfo for true */}
          {showMoreInfo && (
            <View className="mt-4 pt-4 border-t border-gray-100">
              {/* Endereço */}
              <TouchableOpacity
                className="flex-row items-center mb-3"
                onPress={handleMapPress}
              >
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
                  <MapPin size={16} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800">
                    {vm.getFormattedAddress()}
                  </Text>
                  <Text className="text-xs text-primary-600">
                    Abrir no mapa
                  </Text>
                </View>
                <ExternalLink size={14} color="#6B7280" />
              </TouchableOpacity>

              {/* Horário */}
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
                  <Clock size={16} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-gray-800">{formatHorario()}</Text>
                  <Text className="text-xs text-gray-500">
                    {vm.getFormattedWorkingHours()}
                  </Text>
                </View>
              </View>

              {/* Redes sociais */}
              {(vm.profile.instagram ||
                vm.profile.facebook ||
                vm.profile.email) && (
                <View className="flex-row items-center">
                  <Text className="text-sm font-medium text-gray-700 mr-2">
                    Redes sociais:
                  </Text>
                  <HStack>{renderSocialIcons()}</HStack>
                </View>
              )}
            </View>
          )}
        </Card>
      </View>
    </View>
  );
}
