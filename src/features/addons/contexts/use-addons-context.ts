// Path: src/features/addons/contexts/use-addons-context.ts
import { useContext } from "react";
import { AddonsContext } from "./addons.context-value";

export const useAddonsContext = () => {
  const context = useContext(AddonsContext);
  if (!context) {
    throw new Error("useAddonsContext must be used within an AddonsProvider");
  }
  return context;
};
