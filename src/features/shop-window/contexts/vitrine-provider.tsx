// Path: src/features/vitrine/contexts/vitrine-provider.tsx
import React, { ReactNode } from "react";
import { VitrineContext } from "./vitrine.context-value";
import { useVitrineViewModel } from "../view-models/vitrine.view-model";

interface VitrineProviderProps {
  children: ReactNode;
}

export function VitrineProvider({ children }: VitrineProviderProps) {
  const viewModel = useVitrineViewModel();

  return (
    <VitrineContext.Provider value={viewModel}>
      {children}
    </VitrineContext.Provider>
  );
}
