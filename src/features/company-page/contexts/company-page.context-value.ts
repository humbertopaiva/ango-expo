// src/features/company-page/contexts/company-page.context-value.ts
import { createContext } from "react";
import { ICompanyPageViewModel } from "../view-models/company-page.view-model.interface";

export const CompanyPageContext = createContext<
  ICompanyPageViewModel | undefined
>(undefined);
