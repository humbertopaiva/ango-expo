// Path: src/components/custom/form-toast-alert.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AlertTriangle, CheckCircle, X, Info } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "error" | "warning" | "success" | "info";

interface FormToastAlertProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  duration?: number; // em ms
}

export function FormToastAlert({
  visible,
  onClose,
  message,
  type = "error",
  duration = 4000,
}: FormToastAlertProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      // Resetar valores antes de mostrar
      opacity.setValue(0);
      translateY.setValue(-50);

      // Animação para exibir o toast
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();

      // Configurar timer para fechar automaticamente
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    // Animação para esconder o toast
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#ECFDF5";
      case "warning":
        return "#FFFBEB";
      case "info":
        return "#EFF6FF";
      case "error":
      default:
        return "#FEF2F2";
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "#A7F3D0";
      case "warning":
        return "#FDE68A";
      case "info":
        return "#BFDBFE";
      case "error":
      default:
        return "#FECACA";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "info":
        return "#3B82F6";
      case "error":
      default:
        return "#EF4444";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color={getIconColor()} />;
      case "warning":
      case "error":
        return <AlertTriangle size={20} color={getIconColor()} />;
      case "info":
        return <Info size={20} color={getIconColor()} />;
      default:
        return <AlertTriangle size={20} color={getIconColor()} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity,
          transform: [{ translateY }],
          marginTop: insets.top,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 9999,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
  },
});
