// Path: src/features/vitrine/pages/vitrine-page.tsx
import React from "react";
import { VitrineProvider } from "../contexts/vitrine-provider";
import { VitrinePageContent } from "./vitrine-page-content";

export function VitrinePage() {
  return (
    <VitrineProvider>
      <VitrinePageContent />
    </VitrineProvider>
  );
}
