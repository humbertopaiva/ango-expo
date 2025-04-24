// Path: src/features/addons/contexts/addons-provider.tsx
import { ReactNode } from "react";
import { AddonsContext } from "./addons.context-value";
import { useAddonsViewModel } from "../view-models/addons.view-model";

interface AddonsProviderProps {
  children: ReactNode;
}

export function AddonsProvider({ children }: AddonsProviderProps) {
  const viewModel = useAddonsViewModel();

  return (
    <AddonsContext.Provider value={viewModel}>
      {children}
    </AddonsContext.Provider>
  );
}
