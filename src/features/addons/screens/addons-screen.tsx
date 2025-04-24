// Path: src/features/addons/screens/addons-screen.tsx
import React from "react";

import { View } from "react-native";
import { AddonsProvider } from "../contexts/addons-provider";
import { AddonsContent } from "./addons-content";

export function AddonsScreen() {
  return (
    <View className="flex-1 bg-white">
      <AddonsProvider>
        <AddonsContent />
      </AddonsProvider>
    </View>
  );
}
