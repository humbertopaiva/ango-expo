// src/features/company-page/contexts/use-company-page-context.ts
import { useContext } from "react";
import { CompanyPageContext } from "./company-page.context-value";

export function useCompanyPageContext() {
  const context = useContext(CompanyPageContext);
  if (!context) {
    throw new Error(
      "useCompanyPageContext must be used within a CompanyPageProvider"
    );
  }
  return context;
}
