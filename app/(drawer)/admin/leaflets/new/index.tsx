// app/(app)/admin/leaflets/new/index.tsx

import React from "react";
import { LeafletFormScreen } from "@/src/features/leaflets/components/leaflet-form";
import ScreenHeader from "@/components/ui/screen-header";
import { View } from "@gluestack-ui/themed";

export default function NewLeafletPage() {
  return (
    <View className="flex-1 bg-background">
      <LeafletFormScreen />
    </View>
  );
}
