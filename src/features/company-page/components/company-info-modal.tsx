// Path: src/features/company-page/components/company-info-modal.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  Modal,
  VStack,
  HStack,
  Divider,
  Box,
  Heading,
} from "@gluestack-ui/themed";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  X,
  Facebook,
  Instagram,
  Mail,
  Globe,
  Truck,
  CreditCard,
  ShieldCheck,
  DollarSign,
  Info,
  Check,
  X as XIcon,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { formatSocialUrl } from "@/src/utils/social.utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDateToTimeString } from "@/src/utils/date.utils";
import { SafeMap } from "@/components/common/safe-map";
import { getPaymentMethod } from "@/src/utils/payment-methods.utils";
import { PaymentMethodsDisplay } from "./payment-methods-display";

interface CompanyInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function CompanyInfoModal({
  isVisible,
  onClose,
}: CompanyInfoModalProps) {
  const vm = useCompanyPageContext();
  const insets = useSafeAreaInsets();
  const { config, profile } = vm;

  if (!profile) return null;

  const primaryColor = vm.primaryColor || "#F4511E";

  // Formata valores monetários
  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    const numericValue = parseFloat(value) / 100;
    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para formatar o horário (remover segundos)
  const formatTime = (time?: string): string => {
    if (!time) return "--:--";
    if (time.includes(":")) {
      return time.substring(0, 5); // apenas "HH:MM"
    }
    return time;
  };

  // Manipuladores para links e ações
  const handlePhoneCall = async () => {
    if (profile?.telefone) {
      const phoneNumber = profile.telefone.replace(/\D/g, "");
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
    if (profile?.email) {
      await Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleMapPress = async () => {
    if (!profile?.endereco) return;

    const address = encodeURIComponent(profile.endereco);

    if (Platform.OS === "ios") {
      Linking.openURL(`maps://?q=${address}`);
    } else if (Platform.OS === "android") {
      Linking.openURL(`geo:0,0?q=${address}`);
    } else {
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  // Verificar se existem redes sociais
  const hasSocialNetworks = profile.instagram || profile.facebook;

  // Dias da semana para exibição
  const days = [
    { key: "domingo", name: "Domingo" },
    { key: "segunda", name: "Segunda-feira" },
    { key: "terca", name: "Terça-feira" },
    { key: "quarta", name: "Quarta-feira" },
    { key: "quinta", name: "Quinta-feira" },
    { key: "sexta", name: "Sexta-feira" },
    { key: "sabado", name: "Sábado" },
  ];

  return (
    <Modal isOpen={isVisible} onClose={onClose} avoidKeyboard size="full">
      <Modal.Backdrop />
      <Modal.Content
        style={{
          maxWidth: Platform.OS === "web" ? 480 : "92%",
          marginBottom: insets.bottom || 0,
          marginTop: Platform.OS === "web" ? "10%" : insets.top || 0,
          maxHeight: "90%",
        }}
        className="rounded-t-3xl rounded-b-3xl"
      >
        <Modal.Header className="border-b-0 pb-0">
          <HStack className="items-center justify-between w-full">
            <Heading size="lg" className="text-gray-800">
              {profile.nome}
            </Heading>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </HStack>
        </Modal.Header>

        <Modal.Body>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Sobre */}
            {profile.descricao && (
              <Box className="mb-6">
                <Heading size="sm" className="mb-2 text-gray-800">
                  Sobre
                </Heading>
                <Text className="text-gray-700 text-base leading-relaxed">
                  {profile.descricao}
                </Text>
              </Box>
            )}
            {/* Seção de Localização */}
            {profile.endereco && (
              <VStack space="md" className="mb-6">
                <SectionHeader
                  icon={MapPin}
                  title="Localização"
                  color={primaryColor}
                />

                <TouchableOpacity onPress={handleMapPress}>
                  <View className="bg-gray-50 px-4 py-3 rounded-lg">
                    <Text className="text-gray-700 text-base">
                      {profile.endereco}
                    </Text>
                    <Text className="text-sm mt-1 text-primary-600">
                      Abrir no mapa
                    </Text>
                  </View>
                </TouchableOpacity>
              </VStack>
            )}
            {/* Seção de Horário de Funcionamento */}
            <VStack space="md" className="mb-6">
              <SectionHeader
                icon={Clock}
                title="Horário de Funcionamento"
                color={primaryColor}
              />

              <Box className="bg-gray-50 rounded-lg p-4">
                {days.map((day) => {
                  const isOpenDay = profile.dias_funcionamento?.includes(
                    day.key
                  );
                  const openTimeKey = `abertura_${day.key}`;
                  const closeTimeKey = `fechamento_${day.key}`;

                  // Acesse as propriedades de forma segura
                  const openTime = profile[openTimeKey as keyof typeof profile];
                  const closeTime =
                    profile[closeTimeKey as keyof typeof profile];

                  return (
                    <HStack
                      key={day.key}
                      className="justify-between py-1.5 items-center"
                    >
                      <Text className="text-gray-700 font-medium">
                        {day.name}
                      </Text>
                      <HStack className="items-center" space="sm">
                        {isOpenDay ? (
                          <>
                            <Text className="text-gray-600">
                              {formatTime(openTime as string)} -{" "}
                              {formatTime(closeTime as string)}
                            </Text>
                            <View className="bg-green-100 p-1 rounded-full ml-2">
                              <Check size={12} color="#22C55E" />
                            </View>
                          </>
                        ) : (
                          <>
                            <Text className="text-gray-400">Fechado</Text>
                            <View className="bg-red-100 p-1 rounded-full ml-2">
                              <XIcon size={12} color="#EF4444" />
                            </View>
                          </>
                        )}
                      </HStack>
                    </HStack>
                  );
                })}
              </Box>
            </VStack>
            {/* Seção de Informações de Entrega */}
            {config?.delivery && vm.hasDelivery() && (
              <VStack space="md" className="mb-6">
                <SectionHeader
                  icon={Truck}
                  title="Delivery"
                  color={primaryColor}
                />

                <Box className="space-y-4">
                  <HStack className="flex-wrap gap-2">
                    {/* Tempo estimado */}
                    {config.delivery.tempo_estimado_entrega && (
                      <Box className="bg-gray-50 px-4 py-3 rounded-lg flex-1 min-w-40">
                        <Text className="text-sm text-gray-500">
                          Tempo estimado
                        </Text>
                        <HStack className="items-center mt-1">
                          <Clock size={14} color="#6B7280" />
                          <Text className="text-gray-800 font-medium ml-1">
                            {config.delivery.tempo_estimado_entrega} minutos
                          </Text>
                        </HStack>
                      </Box>
                    )}

                    {/* Taxa de entrega */}
                    {config.delivery.taxa_entrega && (
                      <Box className="bg-gray-50 px-4 py-3 rounded-lg flex-1 min-w-40">
                        <Text className="text-sm text-gray-500">
                          Taxa de entrega
                        </Text>
                        <HStack className="items-center mt-1">
                          <DollarSign size={14} color="#6B7280" />
                          <Text className="text-gray-800 font-medium ml-1">
                            {formatCurrency(config.delivery.taxa_entrega)}
                          </Text>
                        </HStack>
                      </Box>
                    )}

                    {/* Pedido mínimo */}
                    {config.delivery.pedido_minimo && (
                      <Box className="bg-gray-50 px-4 py-3 rounded-lg flex-1 min-w-40">
                        <Text className="text-sm text-gray-500">
                          Pedido mínimo
                        </Text>
                        <HStack className="items-center mt-1">
                          <DollarSign size={14} color="#6B7280" />
                          <Text className="text-gray-800 font-medium ml-1">
                            {formatCurrency(config.delivery.pedido_minimo)}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </HStack>

                  {/* Bairros atendidos */}
                  {config.delivery.especificar_bairros_atendidos &&
                    config.delivery.bairros_atendidos?.length > 0 && (
                      <Box className="bg-gray-50 px-4 py-3 rounded-lg">
                        <Text className="text-gray-700 font-medium mb-2">
                          Bairros atendidos:
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          <SafeMap
                            data={config.delivery.bairros_atendidos}
                            renderItem={(bairro, index) => (
                              <View
                                key={index}
                                className="bg-gray-100 px-3 py-1 rounded-full"
                              >
                                <Text className="text-gray-700 text-sm">
                                  {bairro}
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      </Box>
                    )}

                  {/* Observações sobre entrega */}
                  {config.delivery.observacoes && (
                    <Box className="bg-gray-50 px-4 py-3 rounded-lg">
                      <Text className="text-gray-700 font-medium mb-1">
                        Observações:
                      </Text>
                      <Text className="text-gray-600">
                        {config.delivery.observacoes}
                      </Text>
                    </Box>
                  )}
                </Box>
              </VStack>
            )}
            {/* Seção de Contato */}
            {(profile.telefone || profile.whatsapp || profile.email) && (
              <VStack space="md" className="mb-6">
                <SectionHeader
                  icon={Phone}
                  title="Contato"
                  color={primaryColor}
                />

                <Box className="space-y-3">
                  {/* Telefone */}
                  {profile.telefone && (
                    <TouchableOpacity
                      onPress={handlePhoneCall}
                      className="bg-gray-50 px-4 py-3 rounded-lg flex-row items-center"
                    >
                      <Phone size={18} color="#6B7280" />
                      <View className="ml-3">
                        <Text className="text-sm text-gray-500">Telefone</Text>
                        <Text className="text-gray-800 font-medium">
                          {profile.telefone}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* WhatsApp */}
                  {profile.whatsapp && (
                    <TouchableOpacity
                      onPress={handleWhatsApp}
                      className="bg-gray-50 px-4 py-3 rounded-lg flex-row items-center"
                    >
                      <MessageCircle size={18} color="#25D366" />
                      <View className="ml-3">
                        <Text className="text-sm text-gray-500">WhatsApp</Text>
                        <Text className="text-gray-800 font-medium">
                          {profile.whatsapp}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Email */}
                  {profile.email && (
                    <TouchableOpacity
                      onPress={handleEmailPress}
                      className="bg-gray-50 px-4 py-3 rounded-lg flex-row items-center"
                    >
                      <Mail size={18} color="#6B7280" />
                      <View className="ml-3">
                        <Text className="text-sm text-gray-500">Email</Text>
                        <Text className="text-gray-800 font-medium">
                          {profile.email}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </Box>
              </VStack>
            )}
            {/* Seção de Redes Sociais */}
            {hasSocialNetworks && (
              <VStack space="md" className="mb-6">
                <SectionHeader
                  icon={Globe}
                  title="Redes Sociais"
                  color={primaryColor}
                />

                <HStack className="gap-3 flex-wrap">
                  {/* Instagram */}
                  {profile.instagram && (
                    <TouchableOpacity
                      onPress={() =>
                        handleSocialLink("instagram", profile.instagram || "")
                      }
                      className="flex-1 bg-gray-50 px-6 py-4 rounded-lg items-center min-w-24"
                    >
                      <Instagram size={24} color="#E1306C" />
                      <Text className="text-xs text-gray-500 mt-2">
                        Instagram
                      </Text>
                      <Text className="text-gray-700 font-medium mt-1">
                        @
                        {profile.instagram
                          .replace(/^@/, "")
                          .replace(/.*\//, "")}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Facebook */}
                  {profile.facebook && (
                    <TouchableOpacity
                      onPress={() =>
                        handleSocialLink("facebook", profile.facebook || "")
                      }
                      className="flex-1 bg-gray-50 px-6 py-4 rounded-lg items-center min-w-24"
                    >
                      <Facebook size={24} color="#1877F2" />
                      <Text className="text-xs text-gray-500 mt-2">
                        Facebook
                      </Text>
                      <Text className="text-gray-700 font-medium mt-1">
                        {profile.facebook.replace(/^@/, "").replace(/.*\//, "")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </HStack>
              </VStack>
            )}
            {/*  Formas de Pagamento, se disponível  */}
            {profile.opcoes_pagamento &&
              profile.opcoes_pagamento.filter((op) => op.ativo).length > 0 && (
                <VStack space="md" className="mb-6">
                  <View className="flex-row flex-wrap gap-3 bg-yellow-400">
                    {profile.opcoes_pagamento &&
                      profile.opcoes_pagamento.filter((op) => op.ativo).length >
                        0 && (
                        <VStack space="md" className="mb-6">
                          <SectionHeader
                            icon={CreditCard}
                            title="Formas de Pagamento"
                            color={primaryColor}
                          />

                          <PaymentMethodsDisplay
                            paymentOptions={profile.opcoes_pagamento}
                            primaryColor={primaryColor}
                          />
                        </VStack>
                      )}
                  </View>
                </VStack>
              )}
            {/* Diferenciais/Adicionais, se houver */}
            {profile.adicionais && profile.adicionais.length > 0 && (
              <VStack space="md" className="mb-6">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Diferenciais"
                  color={primaryColor}
                />

                <View className="flex-row flex-wrap gap-2">
                  {profile.adicionais.map((adicional, index) => (
                    <View
                      key={index}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${primaryColor}10`,
                      }}
                    >
                      <Text
                        style={{ color: primaryColor }}
                        className="font-medium"
                      >
                        {adicional}
                      </Text>
                    </View>
                  ))}
                </View>
              </VStack>
            )}
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

// Componente auxiliar para os cabeçalhos de seção
function SectionHeader({
  icon: Icon,
  title,
  color = "#F4511E",
}: {
  icon: any;
  title: string;
  color: string;
}) {
  return (
    <HStack space="sm" alignItems="center" className="mb-3">
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={18} color={color} />
      </View>
      <Heading size="sm" className="text-gray-800">
        {title}
      </Heading>
    </HStack>
  );
}
