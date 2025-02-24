// src/features/leaflets/contexts/leaflets-provider.tsx

import { ReactNode } from "react";
import { LeafletsContext } from "./leaflets.context-value";
import { useLeafletsViewModel } from "../view-models/leaflets.view-model";

interface LeafletsProviderProps {
  children: ReactNode;
}

export function LeafletsProvider({ children }: LeafletsProviderProps) {
  const viewModel = useLeafletsViewModel();

  return (
    <LeafletsContext.Provider value={viewModel}>
      {children}
    </LeafletsContext.Provider>
  );
}
