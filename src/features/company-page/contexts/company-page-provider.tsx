// src/features/company-page/contexts/company-page-provider.tsx
import { ReactNode } from "react";
import { CompanyPageContext } from "./company-page.context-value";
import { useCompanyPageViewModel } from "../view-models/company-page.view-model";

interface CompanyPageProviderProps {
  children: ReactNode;
  companySlug: string;
}

export function CompanyPageProvider({
  children,
  companySlug,
}: CompanyPageProviderProps) {
  const viewModel = useCompanyPageViewModel(companySlug);

  return (
    <CompanyPageContext.Provider value={viewModel}>
      {children}
    </CompanyPageContext.Provider>
  );
}
