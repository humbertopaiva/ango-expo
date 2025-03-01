// Path: components/navigation/app-bar.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, ArrowLeft } from "lucide-react-native";
import { router, useNavigation, usePathname } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { THEME_COLORS } from "@/src/styles/colors";
import { useCompanyData } from "@/src/hooks/use-company-data";
import { HStack } from "@gluestack-ui/themed";

interface AppBarProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  onBackButtonPress?: () => void;
  backPath?: string;
  showMenuButton?: boolean;
  rightContent?: React.ReactNode;
}

export function AppBar({
  title,
  subtitle,
  showBackButton = false,
  backgroundColor = THEME_COLORS.primary,
  onBackButtonPress,
  backPath,
  showMenuButton = true,
  rightContent,
}: AppBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const pathname = usePathname();
  const { company } = useCompanyData();
  const isWeb = Platform.OS === "web";

  const statusBarHeight =
    Platform.OS === "ios" ? insets.top : StatusBar.currentHeight || 0;

  const handleBackPress = () => {
    if (onBackButtonPress) {
      onBackButtonPress();
    } else if (backPath) {
      router.push(backPath as any);
    } else {
      router.back();
    }
  };

  const handleMenuPress = () => {
    try {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (error) {
      console.log(
        "Não foi possível abrir o drawer. Certifique-se que está dentro de um DrawerNavigator"
      );
    }
  };

  return (
    <View>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />

      <View
        style={{
          backgroundColor: backgroundColor,
          paddingTop: statusBarHeight,
        }}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          className="px-12 py-16"
          height={56 + statusBarHeight}
        >
          {/* Lado esquerdo: Botão de menu/voltar e título */}
          <HStack alignItems="center" space="md" flex={1}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={handleBackPress}
                className="p-2 -ml-2 rounded-full active:bg-white/20"
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
            ) : showMenuButton ? (
              <TouchableOpacity
                onPress={handleMenuPress}
                className="p-2 -ml-2 rounded-full active:bg-white/20"
              >
                <Menu size={24} color="white" />
              </TouchableOpacity>
            ) : null}

            {/* Logo ou título */}
            {!title ? (
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={{ height: 32, width: 120 }}
                resizeMode="contain"
              />
            ) : (
              <View>
                <Text className="text-white font-semibold text-lg">
                  {title}
                </Text>
                {subtitle && (
                  <Text className="text-white/80 text-xs">{subtitle}</Text>
                )}
              </View>
            )}
          </HStack>

          {/* Conteúdo do lado direito (opcional) */}
          {rightContent}
        </HStack>
      </View>
    </View>
  );
}
