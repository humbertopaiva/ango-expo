// src/features/leaflets/contexts/use-leaflets-context.ts

import { useContext } from "react";
import { LeafletsContext } from "./leaflets.context-value";

export const useLeafletsContext = () => {
  const context = useContext(LeafletsContext);
  if (!context) {
    throw new Error(
      "useLeafletsContext must be used within a LeafletsProvider"
    );
  }
  return context;
};
