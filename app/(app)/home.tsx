import { Box } from "@/components/ui/box";
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 justify-center items-center bg-green-700">
        <Text className="text-xl font-gothic">Home Screen 3</Text>
      </Box>
    </SafeAreaView>
  );
}
