// Path: src/features/vitrine/contexts/use-vitrine-context.ts
import { useContext } from "react";
import { VitrineContext } from "./vitrine.context-value";

export const useVitrineContext = () => {
  const context = useContext(VitrineContext);
  if (!context) {
    throw new Error("useVitrineContext must be used within a VitrineProvider");
  }
  return context;
};
