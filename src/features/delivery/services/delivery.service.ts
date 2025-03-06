// Path: src/features/delivery/services/delivery.service.ts
import { api } from "@/src/services/api";
import { DeliveryProfile } from "../models/delivery-profile";
import { Subcategory } from "../models/subcategory";

class DeliveryService {
  async getProfiles(): Promise<DeliveryProfile[]> {
    try {
      const response = await api.get("/api/delivery/profiles");
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfis de delivery:", error);
      return [];
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    try {
      const response = await api.get("/api/delivery/subcategories");
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar subcategorias de delivery:", error);
      return [];
    }
  }
}

export const deliveryService = new DeliveryService();
