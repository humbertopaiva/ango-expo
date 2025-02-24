// app/(app)/admin/leaflets/_layout.tsx

import React from "react";
import { Slot } from "expo-router";
import { LeafletsProvider } from "@/src/features/leaflets/contexts/leaflets-provider";

export default function LeafletsLayout() {
  return (
    <LeafletsProvider>
      <Slot />
    </LeafletsProvider>
  );
}
