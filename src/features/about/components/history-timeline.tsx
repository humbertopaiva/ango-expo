// Path: src/features/about/components/history-timeline.tsx
import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";

interface HistoryItem {
  year: string;
  title: string;
  description: string;
}

interface HistoryTimelineProps {
  history: HistoryItem[];
}

export function HistoryTimeline({ history }: HistoryTimelineProps) {
  return (
    <View className="mb-12 px-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Nossa Jornada
      </Text>

      <View className="mx-2">
        {history.map((item, index) => (
          <View key={index} className="mb-8 relative">
            {/* Linha conectora */}
            {index !== history.length - 1 && (
              <View
                className="absolute left-4 top-14 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-100"
                style={{ marginLeft: 8 }}
              />
            )}

            <View className="flex-row">
              <View className="mr-6">
                <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center shadow-md z-10 mb-1">
                  <Calendar size={16} color="#FFFFFF" />
                </View>
                <View className="bg-primary-500 px-3 py-1 rounded-full shadow-sm">
                  <Text className="text-white font-bold text-sm">
                    {item.year}
                  </Text>
                </View>
              </View>

              <View className="flex-1 bg-white p-4 rounded-xl shadow-md border-l-4 border-primary-500">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </Text>
                <Text className="text-gray-600 leading-6">
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
