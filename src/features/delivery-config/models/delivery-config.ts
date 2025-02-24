// src/features/delivery-config/models/delivery-config.ts
export interface Company {
  id: string;
  status: string;
  sort: number | null;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string;
  categoria: string;
  nome: string;
  slug: string;
  usuario: string;
  plano: string;
  segmento: string;
  logo: string | null;
  banner: string | null;
  cor_primaria: string;
  whatsapp: string | null;
  subcategorias: number[];
}

export interface DeliveryConfig {
  id: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string;
  tempo_estimado_entrega: number;
  especificar_bairros_atendidos: boolean;
  bairros_atendidos: string[];
  observacoes: string;
  taxa_entrega: string;
  pedido_minimo: string;
  empresa: Company;
}

export interface DeliveryConfigResponse {
  status: string;
  data: {
    delivery: DeliveryConfig;
  };
}

export type CreateDeliveryConfigDTO = Omit<
  DeliveryConfig,
  | "id"
  | "user_created"
  | "date_created"
  | "user_updated"
  | "date_updated"
  | "empresa"
>;

export type UpdateDeliveryConfigDTO = Partial<CreateDeliveryConfigDTO>;
