// Path: src/features/delivery/models/delivery-profile.ts
export interface DeliveryProfile {
  id: string;
  nome: string;
  endereco?: string;
  whatsapp?: string;
  logo?: string | null;
  banner?: string | null;
  abertura_segunda?: string;
  fechamento_segunda?: string;
  abertura_terca?: string;
  fechamento_terca?: string;
  abertura_quarta?: string;
  fechamento_quarta?: string;
  abertura_quinta?: string;
  fechamento_quinta?: string;
  abertura_sexta?: string;
  fechamento_sexta?: string;
  abertura_sabado?: string;
  fechamento_sabado?: string;
  abertura_domingo?: string;
  fechamento_domingo?: string;
  dias_funcionamento: string[];
  empresa: {
    id: string;
    slug: string;
    status: string;
    subcategorias: Array<{
      subcategorias_empresas_id: {
        id: string;
        nome: string;
        slug: string;
        imagem?: string;
      };
    }>;
  };
}
