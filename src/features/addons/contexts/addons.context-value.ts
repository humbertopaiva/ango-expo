// Path: src/features/addons/contexts/addons.context-value.ts
import { createContext } from "react";
import { IAddonsViewModel } from "../view-models/addons.view-model.interface";

export const AddonsContext = createContext<IAddonsViewModel | undefined>(
  undefined
);
