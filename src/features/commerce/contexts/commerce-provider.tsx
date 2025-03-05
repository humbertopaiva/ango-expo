import { ReactNode } from "react";
import { CommerceContext } from "./commerce.context-value";
import { useCommerceViewModel } from "../view-models/commerce.view-model";

interface CommerceProviderProps {
  children: ReactNode;
}

export function CommerceProvider({ children }: CommerceProviderProps) {
  const viewModel = useCommerceViewModel();

  return (
    <CommerceContext.Provider value={viewModel}>
      {children}
    </CommerceContext.Provider>
  );
}
