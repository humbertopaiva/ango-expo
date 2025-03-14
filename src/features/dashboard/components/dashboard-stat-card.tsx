// src/features/dashboard/components/dashboard-stat-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  subtitle,
  trend,
  onPress,
}: DashboardStatCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} className="w-full">
      <Card className={`p-4 ${bgColor} border border-${color}-100`}>
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-sm text-gray-600">{title}</Text>
            <Text className="text-2xl font-semilbold mt-1">{value}</Text>
            {subtitle && (
              <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
            )}
            {trend && (
              <View className="flex-row items-center mt-2">
                <View
                  className={`px-1.5 py-0.5 rounded-full ${
                    trend.isPositive ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      trend.isPositive ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {trend.isPositive ? "+" : "-"}
                    {trend.value}%
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 ml-1">
                  vs último mês
                </Text>
              </View>
            )}
          </View>
          <View
            className="p-2 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} color={color} />
          </View>
        </View>
      </Card>
    </Container>
  );
}
