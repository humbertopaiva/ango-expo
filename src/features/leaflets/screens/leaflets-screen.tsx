// src/features/leaflets/screens/leaflets-screen.tsx

import React from "react";
import { LeafletsProvider } from "../contexts/leaflets-provider";
import { LeafletsContent } from "./leaflets-content";

export function LeafletsScreen() {
  return (
    <LeafletsProvider>
      <LeafletsContent />
    </LeafletsProvider>
  );
}
