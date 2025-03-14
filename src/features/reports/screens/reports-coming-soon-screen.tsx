// Path: src/features/reports/screens/reports-coming-soon-screen.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Calendar, BarChart2 } from "lucide-react-native";
import ScreenHeader from "@/components/ui/screen-header";

export function ReportsComingSoonScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader title="Relatórios" />

      <View className="flex-1 justify-center items-center p-6">
        <Card className="w-full p-6 items-center">
          <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4">
            <BarChart2 size={32} color="#F4511E" />
          </View>

          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Relatórios em breve!
          </Text>

          <Text className="text-center text-gray-600 mb-6">
            Estamos desenvolvendo relatórios detalhados sobre o desempenho do
            seu negócio. Em breve você poderá acompanhar vendas, visualizações e
            muito mais.
          </Text>

          <View className="flex-row items-center bg-primary-50 p-3 rounded-lg">
            <Calendar size={18} color="#F4511E" />
            <Text className="ml-2 text-primary-700">
              Previsão de lançamento: Junho 2025
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
}
