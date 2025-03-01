// src/components/ui/toast.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  AlertTriangle,
} from "lucide-react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  onDismiss: (id: string) => void;
  duration?: number;
}

export function Toast({
  id,
  title,
  description,
  type = "info",
  onDismiss,
  duration = 5000,
}: ToastProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const getIconForType = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color="#16A34A" />;
      case "error":
        return <AlertCircle size={20} color="#DC2626" />;
      case "warning":
        return <AlertTriangle size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#2563EB" />;
    }
  };

  const getBackgroundForType = (type: ToastType) => {
    switch (type) {
      case "success":
        return "#F0FDF4";
      case "error":
        return "#FEF2F2";
      case "warning":
        return "#FFFBEB";
      default:
        return "#EFF6FF";
    }
  };

  const getBorderColorForType = (type: ToastType) => {
    switch (type) {
      case "success":
        return "#22C55E";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      default:
        return "#3B82F6";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: getBackgroundForType(type),
          borderLeftColor: getBorderColorForType(type),
        },
      ]}
      className="shadow-md"
    >
      <View style={styles.iconContainer}>{getIconForType(type)}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <X size={18} color="#6B7280" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={[
        styles.toastContainer,
        Platform.OS === "web"
          ? { position: "fixed" as any, zIndex: 50 }
          : { position: "absolute" as any, zIndex: 50 },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    top: 70,
    right: 16,
    width: 340,
    maxWidth: "90%",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    paddingRight: 12,
    paddingTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#111827",
  },
  description: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 2,
  },
  closeButton: {
    padding: 2,
    marginLeft: 8,
  },
});
