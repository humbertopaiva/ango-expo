// Path: src/features/dashboard/components/dashboard-support-card.tsx
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { HelpCircle, ArrowRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface DashboardSupportCardProps {
  onPress: () => void;
  primaryColor: string;
}

export function DashboardSupportCard({
  onPress,
  primaryColor,
}: DashboardSupportCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.supportCard}
      onPress={onPress}
    >
      <LinearGradient
        colors={[primaryColor, "#6200EE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.supportGradient}
      >
        <View style={styles.supportContent}>
          <View style={styles.supportIconContainer}>
            <HelpCircle size={32} color="white" />
          </View>
          <Text style={styles.supportTitle}>Área de Suporte</Text>
          <Text style={styles.supportText}>
            Precisa de ajuda? Nossa equipe está disponível para atendê-lo.
          </Text>
          <View style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Acessar Suporte</Text>
            <ArrowRight size={16} color="white" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  supportCard: {
    borderRadius: 16,
    overflow: "hidden",
    // Sombras unificadas para iOS e Android
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  supportGradient: {
    padding: 20,
  },
  supportContent: {
    padding: 4,
  },
  supportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  supportTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  supportButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 8,
  },
});
