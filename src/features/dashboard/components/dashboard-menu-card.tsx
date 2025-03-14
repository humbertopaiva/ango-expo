// Path: src/features/dashboard/components/dashboard-menu-card.tsx
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { ArrowRight } from "lucide-react-native";

interface DashboardMenuCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  onPress: () => void;
}

export function DashboardMenuCard({
  title,
  icon: Icon,
  color,
  onPress,
}: DashboardMenuCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.menuCard, { borderColor: `${color}20` }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.cardTitle} className="font-semibold">
        {title}
      </Text>
      <ArrowRight size={16} color="#9CA3AF" style={styles.cardIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 120,
    justifyContent: "space-between",
    // Sombras unificadas para iOS e Android
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#374151",
    marginTop: 8,
  },
  cardIcon: {
    alignSelf: "flex-end",
  },
});
