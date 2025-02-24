// src/features/delivery-config/screens/delivery-config-screen.tsx
import React from "react";
import { DeliveryConfigProvider } from "../contexts/delivery-config-provider";
import { DeliveryConfigContent } from "./delivery-config-content";

export function DeliveryConfigScreen() {
  return (
    <DeliveryConfigProvider>
      <DeliveryConfigContent />
    </DeliveryConfigProvider>
  );
}
