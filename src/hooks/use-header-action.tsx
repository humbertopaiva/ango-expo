// src/hooks/use-header-action.tsx
import { useEffect } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type HeaderActionType = "add" | "back" | "close" | "save" | "menu" | "more";

interface UseHeaderActionProps {
  // Título do header
  title?: string;
  // Configuração de ação
  actionType?: HeaderActionType;
  onPress?: () => void;
  iconSize?: number;
  iconColor?: string;
  customIcon?: React.ReactNode;
  position?: "left" | "right";
  // Configurações adicionais
  showHeader?: boolean;
  headerTintColor?: string;
  headerStyle?: object;
}

export function useHeaderAction({
  title,
  actionType,
  onPress,
  iconSize = 24,
  iconColor = "#F4511E", // primary-500
  customIcon,
  position = "right",
  showHeader = true,
  headerTintColor,
  headerStyle,
}: UseHeaderActionProps) {
  const navigation = useNavigation();

  // Mapa de ícones por tipo
  const iconMap = {
    add: <AntDesign name="pluscircle" size={iconSize} color={iconColor} />,
    back: <Ionicons name="arrow-back" size={iconSize} color={iconColor} />,
    close: <AntDesign name="close" size={iconSize} color={iconColor} />,
    save: <Ionicons name="save-outline" size={iconSize} color={iconColor} />,
    menu: <Ionicons name="menu" size={iconSize} color={iconColor} />,
    more: (
      <Ionicons name="ellipsis-vertical" size={iconSize} color={iconColor} />
    ),
  };

  useEffect(() => {
    const options: any = {};

    // Configurar título se fornecido
    if (title !== undefined) {
      options.title = title;
    }

    // Configurar visibilidade do header
    if (showHeader !== undefined) {
      options.headerShown = showHeader;
    }

    // Configurar cor de tinta do header
    if (headerTintColor) {
      options.headerTintColor = headerTintColor;
    }

    // Configurar estilo do header
    if (headerStyle) {
      options.headerStyle = headerStyle;
    }

    // Configurar ação do header se o tipo for fornecido
    if (actionType && onPress) {
      const headerOption = position === "right" ? "headerRight" : "headerLeft";

      options[headerOption] = () => (
        <Pressable onPress={onPress} style={{ padding: 10 }}>
          {customIcon || iconMap[actionType]}
        </Pressable>
      );
    }

    // Aplicar opções configuradas
    if (Object.keys(options).length > 0) {
      navigation.setOptions(options);
    }
  }, [
    navigation,
    title,
    actionType,
    onPress,
    iconSize,
    iconColor,
    customIcon,
    position,
    showHeader,
    headerTintColor,
    headerStyle,
  ]);
}
