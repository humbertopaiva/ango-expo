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
import { Modal, VStack, HStack, Divider } from "@gluestack-ui/themed";
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
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { formatSocialUrl } from "@/src/utils/social.utils";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  const primaryColor = vm.primaryColor || THEME_COLORS.primary;

  // Formata valores monetários
  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    const numValue = parseFloat(value) / 100;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Formatar dias da semana
  const formatWeekdays = (days: string[]) => {
    if (!days || days.length === 0) return "Não informado";

    const weekdayMap: Record<string, string> = {
      domingo: "Domingo",
      segunda: "Segunda",
      terca: "Terça",
      quarta: "Quarta",
      quinta: "Quinta",
      sexta: "Sexta",
      sabado: "Sábado",
    };

    // Se todos os dias estiverem presentes
    if (days.length === 7) return "Todos os dias";

    return days.map((day) => weekdayMap[day.toLowerCase()] || day).join(", ");
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

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Content
        style={{
          maxWidth: Platform.OS === "web" ? 480 : "92%",
          marginBottom: insets.bottom || 0,
        }}
        className="rounded-t-3xl rounded-b-3xl"
      >
        <Modal.Header className="border-b-0">
          <HStack className="items-center justify-between w-full">
            <Text className="text-xl font-bold">{profile.nome}</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </HStack>
        </Modal.Header>

        <Modal.Body>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Seção de Horário de Funcionamento */}
            <VStack space="md" className="mb-6">
              <HStack space="md" alignItems="center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Clock size={20} color={primaryColor} />
                </View>
                <Text className="text-lg font-semibold">
                  Horário de Funcionamento
                </Text>
              </HStack>

              <View className="ml-14">
                <HStack space="sm" alignItems="center" className="mb-2">
                  <Calendar size={16} color="#6B7280" />
                  <Text className="text-gray-700">
                    {formatWeekdays(profile.dias_funcionamento || [])}
                  </Text>
                </HStack>

                <HStack space="sm" alignItems="center">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-700">
                    {profile.horario_funcionamento
                      ? `${profile.horario_funcionamento.abertura} às ${profile.horario_funcionamento.fechamento}`
                      : "Horário não informado"}
                  </Text>
                </HStack>
              </View>
            </VStack>

            <Divider className="my-4" />

            {/* Seção de Informações de Entrega */}
            {config?.delivery && vm.hasDelivery() && (
              <>
                <VStack space="md" className="mb-6">
                  <HStack space="md" alignItems="center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <Truck size={20} color={primaryColor} />
                    </View>
                    <Text className="text-lg font-semibold">Delivery</Text>
                  </HStack>

                  <View className="ml-14 space-y-3">
                    {config.delivery.tempo_estimado_entrega && (
                      <HStack space="sm" alignItems="center">
                        <Clock size={16} color="#6B7280" />
                        <Text className="text-gray-700">
                          Tempo estimado:{" "}
                          {config.delivery.tempo_estimado_entrega} minutos
                        </Text>
                      </HStack>
                    )}

                    {config.delivery.taxa_entrega && (
                      <HStack space="sm" alignItems="center">
                        <DollarSign size={16} color="#6B7280" />
                        <Text className="text-gray-700">
                          Taxa de entrega:{" "}
                          {formatCurrency(config.delivery.taxa_entrega)}
                        </Text>
                      </HStack>
                    )}

                    {config.delivery.pedido_minimo && (
                      <HStack space="sm" alignItems="center">
                        <DollarSign size={16} color="#6B7280" />
                        <Text className="text-gray-700">
                          Pedido mínimo:{" "}
                          {formatCurrency(config.delivery.pedido_minimo)}
                        </Text>
                      </HStack>
                    )}

                    {config.delivery.especificar_bairros_atendidos &&
                      config.delivery.bairros_atendidos?.length > 0 && (
                        <VStack space="xs">
                          <HStack space="sm" alignItems="center">
                            <MapPin size={16} color="#6B7280" />
                            <Text className="text-gray-700 font-medium">
                              Bairros atendidos:
                            </Text>
                          </HStack>
                          <View className="ml-6 mt-1">
                            {config.delivery.bairros_atendidos.map(
                              (bairro, index) => (
                                <Text
                                  key={index}
                                  className="text-gray-600 text-sm"
                                >
                                  • {bairro}
                                </Text>
                              )
                            )}
                          </View>
                        </VStack>
                      )}

                    {config.delivery.observacoes && (
                      <View className="bg-gray-50 p-3 rounded-lg">
                        <Text className="text-gray-700 text-sm">
                          {config.delivery.observacoes}
                        </Text>
                      </View>
                    )}
                  </View>
                </VStack>

                <Divider className="my-4" />
              </>
            )}

            {/* Seção de Contato */}
            <VStack space="md" className="mb-6">
              <HStack space="md" alignItems="center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Phone size={20} color={primaryColor} />
                </View>
                <Text className="text-lg font-semibold">Contato</Text>
              </HStack>

              <View className="ml-14 space-y-4">
                {profile.telefone && (
                  <TouchableOpacity
                    onPress={handlePhoneCall}
                    className="flex-row items-center"
                  >
                    <Phone size={16} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">
                      {profile.telefone}
                    </Text>
                  </TouchableOpacity>
                )}

                {profile.whatsapp && (
                  <TouchableOpacity
                    onPress={handleWhatsApp}
                    className="flex-row items-center"
                  >
                    <MessageCircle size={16} color="#25D366" />
                    <Text className="text-gray-700 ml-2">
                      {profile.whatsapp}
                    </Text>
                  </TouchableOpacity>
                )}

                {profile.email && (
                  <TouchableOpacity
                    onPress={handleEmailPress}
                    className="flex-row items-center"
                  >
                    <Mail size={16} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">{profile.email}</Text>
                  </TouchableOpacity>
                )}

                {profile.endereco && (
                  <TouchableOpacity
                    onPress={handleMapPress}
                    className="flex-row items-start"
                  >
                    <MapPin
                      size={16}
                      color="#6B7280"
                      style={{ marginTop: 3 }}
                    />
                    <View className="ml-2 flex-1">
                      <Text className="text-gray-700">{profile.endereco}</Text>
                      <Text className="text-xs text-blue-500 mt-1">
                        Abrir no mapa
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </VStack>

            <Divider className="my-4" />

            {/* Seção de Redes Sociais */}
            {(profile.instagram || profile.facebook) && (
              <VStack space="md" className="mb-6">
                <HStack space="md" alignItems="center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Globe size={20} color={primaryColor} />
                  </View>
                  <Text className="text-lg font-semibold">Redes Sociais</Text>
                </HStack>

                <View className="ml-14 space-y-4">
                  {profile.instagram && (
                    <TouchableOpacity
                      onPress={() =>
                        handleSocialLink("instagram", profile.instagram || "")
                      }
                      className="flex-row items-center"
                    >
                      <Instagram size={16} color="#E1306C" />
                      <Text className="text-gray-700 ml-2">
                        @{profile.instagram.replace(/^@/, "")}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {profile.facebook && (
                    <TouchableOpacity
                      onPress={() =>
                        handleSocialLink("facebook", profile.facebook || "")
                      }
                      className="flex-row items-center"
                    >
                      <Facebook size={16} color="#1877F2" />
                      <Text className="text-gray-700 ml-2">
                        {profile.facebook}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </VStack>
            )}

            {/* Formas de Pagamento, se disponível */}
            {profile.opcoes_pagamento &&
              profile.opcoes_pagamento.length > 0 && (
                <>
                  <Divider className="my-4" />

                  <VStack space="md" className="mb-6">
                    <HStack space="md" alignItems="center">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <CreditCard size={20} color={primaryColor} />
                      </View>
                      <Text className="text-lg font-semibold">
                        Formas de Pagamento
                      </Text>
                    </HStack>

                    <View className="ml-14">
                      <View className="flex-row flex-wrap gap-2">
                        {profile.opcoes_pagamento
                          .filter((op) => op.ativo)
                          .map((option, index) => (
                            <View
                              key={index}
                              className="bg-gray-100 px-3 py-1 rounded-full"
                            >
                              <Text className="text-gray-700">
                                {option.tipo}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  </VStack>
                </>
              )}

            {/* Diferenciais/Adicionais, se houver */}
            {profile.adicionais && profile.adicionais.length > 0 && (
              <>
                <Divider className="my-4" />

                <VStack space="md" className="mb-6">
                  <HStack space="md" alignItems="center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <ShieldCheck size={20} color={primaryColor} />
                    </View>
                    <Text className="text-lg font-semibold">Diferenciais</Text>
                  </HStack>

                  <View className="ml-14">
                    <View className="flex-row flex-wrap gap-2">
                      {profile.adicionais.map((adicional, index) => (
                        <View
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full"
                        >
                          <Text className="text-gray-700">{adicional}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </VStack>
              </>
            )}

            {/* Exibir descrição da empresa, se houver */}
            {profile.descricao && (
              <>
                <Divider className="my-4" />

                <VStack space="md" className="mb-4">
                  <Text className="text-lg font-semibold">Sobre nós</Text>
                  <Text className="text-gray-700">{profile.descricao}</Text>
                </VStack>
              </>
            )}
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
