// Path: src/features/vitrine/contexts/vitrine.context-value.ts
import { createContext } from "react";
import { IVitrineViewModel } from "../view-models/vitrine.view-model.interface";

export const VitrineContext = createContext<IVitrineViewModel | undefined>(
  undefined
);
