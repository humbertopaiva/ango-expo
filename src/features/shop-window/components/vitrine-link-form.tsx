// Path: src/features/shop-window/components/vitrine-link-form.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Modal,
  FormControl,
  Input,
  Button,
  VStack,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  ChevronDownIcon,
  Text,
  HStack,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { VitrineLink } from "../models";
import { THEME_COLORS } from "@/src/styles/colors";
import {
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Video,
  Twitter,
  Send,
  Phone,
} from "lucide-react-native";
import { FormControlHelperText } from "@/components/ui/form-control";

const formSchema = z.object({
  texto: z.string().min(1, "Texto é obrigatório"),
  url: z.string().url("URL inválida"),
  tipo_link: z.string().min(1, "Tipo de link é obrigatório"),
  ordem: z.number().optional(),
});

export type VitrineLinkFormData = z.infer<typeof formSchema>;

interface VitrineLinkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VitrineLinkFormData) => void;
  isLoading: boolean;
  link?: VitrineLink;
}

// Lista expandida com todos os tipos de link
const TIPOS_LINK = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { id: "tiktok", label: "TikTok", icon: Video, color: "#000000" },
  { id: "youtube", label: "YouTube", icon: Video, color: "#FF0000" },
  { id: "twitter", label: "Twitter", icon: Twitter, color: "#1DA1F2" },
  { id: "telegram", label: "Telegram", icon: Send, color: "#0088CC" },
  { id: "shopee", label: "Shopee", icon: ShoppingBag, color: "#EE4D2D" },
  {
    id: "mercado_livre",
    label: "Mercado Livre",
    icon: ShoppingCart,
    color: "#FFE600",
  },
  {
    id: "catalogo_pdf",
    label: "Catálogo PDF",
    icon: FileText,
    color: "#F40F02",
  },
  { id: "google_maps", label: "Google Maps", icon: MapPin, color: "#4285F4" },
  { id: "site", label: "Site", icon: Globe, color: THEME_COLORS.primary },
  { id: "telefone", label: "Telefone", icon: Phone, color: "#0CA789" },
  { id: "outro", label: "Outro", icon: Globe, color: "#6B7280" },
];

export function VitrineLinkForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  link,
}: VitrineLinkFormProps) {
  const form = useForm<VitrineLinkFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      texto: "",
      url: "",
      tipo_link: "",
      ordem: 0,
    },
  });

  useEffect(() => {
    if (link) {
      form.reset({
        texto: link.texto,
        url: link.url,
        tipo_link: link.tipo_link,
        ordem: link.ordem,
      });
    } else {
      form.reset({
        texto: "",
        url: "",
        tipo_link: "",
        ordem: 0,
      });
    }
  }, [link, form]);

  // Encontrar o tipo do link selecionado
  const selectedLinkType = TIPOS_LINK.find(
    (tipo) => tipo.id === form.watch("tipo_link")
  );

  // Função para renderizar o texto do input com ícone
  const renderSelectedText = () => {
    if (!selectedLinkType) return "Selecione o tipo";

    const Icon = selectedLinkType.icon;
    return (
      <HStack space="xs" alignItems="center">
        <Icon size={16} color={selectedLinkType.color} />
        <Text>{selectedLinkType.label}</Text>
      </HStack>
    );
  };

  // Função para gerar dica de ajuda baseada no tipo selecionado
  const getLinkHelper = (type: string) => {
    switch (type) {
      case "whatsapp":
        return "Formato: https://wa.me/5511912345678";
      case "instagram":
        return "Formato: https://instagram.com/seu_perfil";
      case "facebook":
        return "Formato: https://facebook.com/seu_perfil";
      case "tiktok":
        return "Formato: https://tiktok.com/@seu_usuario";
      case "youtube":
        return "Formato: https://youtube.com/@seu_canal";
      case "telegram":
        return "Formato: https://t.me/seu_usuario";
      case "google_maps":
        return "URL da localização do seu estabelecimento no Google Maps";
      case "telefone":
        return "Formato: tel:+5511912345678";
      default:
        return "";
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content maxWidth={400} bg="$white" borderRadius="$lg">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize="$lg" fontWeight="$bold" color="$gray800">
            {link ? "Editar Link" : "Adicionar Link"}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <VStack space="md">
            <Controller
              control={form.control}
              name="tipo_link"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error} mb="$2">
                  <FormControl.Label>
                    <Text className="text-gray-700 font-medium">
                      Tipo de Link
                    </Text>
                  </FormControl.Label>
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger
                      borderColor={error ? "$red500" : "$gray200"}
                      borderWidth={1}
                      borderRadius="$md"
                      backgroundColor="$white"
                    >
                      <SelectInput placeholder="Selecione o tipo">
                        {value ? renderSelectedText() : undefined}
                      </SelectInput>
                      <SelectIcon>
                        <ChevronDownIcon color="$gray400" />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {TIPOS_LINK.map((tipo) => (
                          <SelectItem
                            key={tipo.id}
                            label={tipo.label}
                            value={tipo.id}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {error && (
                    <FormControl.Error>
                      <FormControl.Error.Text>
                        {error.message}
                      </FormControl.Error.Text>
                    </FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name="texto"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>
                    <Text className="text-gray-700 font-medium">
                      Texto do Link
                    </Text>
                  </FormControl.Label>
                  <Input>
                    <Input.Input
                      placeholder="Ex: Faça seu pedido"
                      onChangeText={onChange}
                      value={value}
                      borderColor={error ? "$red500" : "$gray200"}
                      backgroundColor="$white"
                    />
                  </Input>
                  {error && (
                    <FormControl.Error>
                      <FormControl.Error.Text>
                        {error.message}
                      </FormControl.Error.Text>
                    </FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name="url"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>
                    <Text className="text-gray-700 font-medium">URL</Text>
                  </FormControl.Label>
                  <Input>
                    <Input.Input
                      placeholder="https://..."
                      onChangeText={onChange}
                      value={value || ""}
                      keyboardType="url"
                      className="bg-white"
                      borderColor={error ? "$red500" : "$gray200"}
                    />
                  </Input>
                  {error && (
                    <FormControl.Error>
                      <FormControl.Error.Text>
                        {error.message}
                      </FormControl.Error.Text>
                    </FormControl.Error>
                  )}
                  {selectedLinkType && getLinkHelper(selectedLinkType.id) && (
                    <FormControlHelperText>
                      <Text className="text-xs text-gray-500">
                        {getLinkHelper(selectedLinkType.id)}
                      </Text>
                    </FormControlHelperText>
                  )}
                </FormControl>
              )}
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <View className="flex-row justify-end gap-2 w-full">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isLoading}
              flex={1}
              borderColor="$gray300"
            >
              <Button.Text color="$gray700">Cancelar</Button.Text>
            </Button>
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              flex={1}
              backgroundColor={THEME_COLORS.primary}
            >
              <Button.Text>{isLoading ? "Salvando..." : "Salvar"}</Button.Text>
            </Button>
          </View>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
