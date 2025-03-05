// src/features/leaflets/contexts/leaflets.context-value.ts
import { createContext } from "react";
import { ILeafletsViewModel } from "../view-models/leaflets.view-model.interface";

export const LeafletsContext = createContext<ILeafletsViewModel | undefined>(
  undefined
);
