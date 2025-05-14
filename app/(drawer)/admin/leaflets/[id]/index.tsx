// app/(app)/admin/leaflets/[id].tsx

import React from "react";
import { LeafletFormScreen } from "@/src/features/leaflets/components/leaflet-form";
import ScreenHeader from "@/components/ui/screen-header";
import { View } from "@gluestack-ui/themed";

export default function EditLeafletPage() {
  return (
    <View className="flex-1 bg-background">
      <LeafletFormScreen />
    </View>
  );
}
