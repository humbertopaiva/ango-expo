// Path: src/features/company-page/models/company-config.ts
export interface CompanyConfig {
  delivery?: {
    tempo_estimado_entrega: number;
    especificar_bairros_atendidos: boolean;
    bairros_atendidos: string[];
    observacoes: string;
    taxa_entrega: string;
    pedido_minimo: string;
  };
  app?: {
    mostrar_info_delivery: boolean | null;
    habilitar_carrinho: boolean | null;
  };
}
