// Path: src/features/vitrine/services/vitrine.service.ts
import { api } from "@/services/api";
import {
  VitrineProduto,
  CreateVitrineProdutoDTO,
  UpdateVitrineProdutoDTO,
  VitrineLink,
  CreateVitrineLinkDTO,
  UpdateVitrineLinkDTO,
} from "../models";

interface ApiResponse<T> {
  status: string;
  data: T[];
  total: number;
  metadata: {
    companyId: string;
    timestamp: string;
    cached: boolean;
    cacheStatus?: string;
  };
}

class VitrineService {
  // Produtos Vitrine
  async getVitrineProdutos(companyId: string) {
    try {
      const response = await api.get<ApiResponse<VitrineProduto>>(
        "/api/vitrine-manager/products",
        {
          params: {
            company: companyId,
            _t: Date.now(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos da vitrine:", error);
      throw error;
    }
  }

  async createVitrineProduto(data: CreateVitrineProdutoDTO) {
    try {
      if (!data.produto) {
        throw new Error("Produto é obrigatório");
      }

      const payload = {
        ...data,
        disponivel: data.disponivel ?? true,
        ordem: data.ordem || "A",
        sort: data.sort || 10,
      };

      const response = await api.post<VitrineProduto>(
        "/api/vitrine-manager/products",
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto na vitrine:", error);
      throw error;
    }
  }

  async updateVitrineProduto(id: number, data: UpdateVitrineProdutoDTO) {
    try {
      if (!data.produto && Object.keys(data).length === 0) {
        throw new Error("Dados de atualização inválidos");
      }

      const response = await api.patch<VitrineProduto>(
        `/api/vitrine-manager/products/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto na vitrine:", error);
      throw error;
    }
  }

  async deleteVitrineProduto(id: number) {
    try {
      await api.delete(`/api/vitrine-manager/products/${id}`);
    } catch (error) {
      console.error("Erro ao excluir produto da vitrine:", error);
      throw error;
    }
  }

  // Links Vitrine
  async getVitrineLinks(companyId: string) {
    try {
      const response = await api.get<ApiResponse<VitrineLink>>(
        "/api/vitrine-manager/links",
        {
          params: {
            company: companyId,
            _t: Date.now(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar links da vitrine:", error);
      throw error;
    }
  }

  async createVitrineLink(data: CreateVitrineLinkDTO) {
    try {
      const response = await api.post<VitrineLink>(
        "/api/vitrine-manager/links",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar link na vitrine:", error);
      throw error;
    }
  }

  async updateVitrineLink(id: string, data: UpdateVitrineLinkDTO) {
    try {
      const response = await api.patch<VitrineLink>(
        `/api/vitrine-manager/links/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar link na vitrine:", error);
      throw error;
    }
  }

  async deleteVitrineLink(id: string) {
    try {
      await api.delete(`/api/vitrine-manager/links/${id}`);
    } catch (error) {
      console.error("Erro ao excluir link da vitrine:", error);
      throw error;
    }
  }
}

export const vitrineService = new VitrineService();
