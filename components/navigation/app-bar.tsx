// Path: components/navigation/app-bar.tsx
import React, { useEffect, useState } from "react";
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
import { userPersistenceService } from "@/src/services/user-persistence.service";

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

  const [userInitials, setUserInitials] = useState("");

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

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await userPersistenceService.getUserPersonalInfo();
      if (userData && userData.fullName) {
        // Obter iniciais do nome
        const names = userData.fullName.split(" ");
        const initials =
          names.length > 1
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : names[0].substring(0, 2).toUpperCase();
        setUserInitials(initials);
      }
    };

    loadUserData();
  }, []);

  return (
    <View>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />

      <View
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          className="px-4 py-4"
          // height={statusBarHeight}
        >
          {/* Lado esquerdo: Botão de menu/voltar e título */}
          <HStack alignItems="center" className="flex-1 justify-between">
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
                className="p-2 -ml-2 rounded-full active:bg-white/20 bg-white/20"
              >
                <Menu size={24} color="white" />
              </TouchableOpacity>
            ) : null}
          </HStack>

          {/* Conteúdo do lado direito (opcional) */}
          {!rightContent && userInitials && (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-8 h-8 rounded-full bg-white/20 items-center justify-center"
            >
              <Text className="text-white font-medium text-xs">
                {userInitials}
              </Text>
            </TouchableOpacity>
          )}
        </HStack>
      </View>
    </View>
  );
}
