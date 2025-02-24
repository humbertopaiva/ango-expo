// src/features/delivery-config/view-models/delivery-config.view-model.interface.ts
import {
  DeliveryConfig,
  UpdateDeliveryConfigDTO,
} from "../models/delivery-config";

export interface IDeliveryConfigViewModel {
  // Estado
  config: DeliveryConfig | null;
  isLoading: boolean;
  isUpdating: boolean;

  // Handlers
  handleSubmit: (data: UpdateDeliveryConfigDTO) => void;
}
