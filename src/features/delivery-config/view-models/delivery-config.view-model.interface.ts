// Path: src/features/delivery-config/view-models/delivery-config.view-model.interface.ts

import {
  DeliveryConfig,
  UpdateDeliveryConfigDTO,
} from "../models/delivery-config";
import { DeliveryConfigFormData } from "../schemas/delivery-config.schema";
import { MutableRefObject } from "react";

export interface IDeliveryConfigViewModel {
  // Estado
  config: DeliveryConfig | null;
  isLoading: boolean;
  isUpdating: boolean;
  isSaved: boolean;
  formRef: MutableRefObject<any>;

  // Handlers
  handleSubmit: (data: DeliveryConfigFormData) => void;
}
