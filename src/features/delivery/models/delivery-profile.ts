export interface DeliveryProfile {
  id: string;
  nome: string;
  whatsapp: string;
  endereco: string;
  banner: string | null;
  logo: string | null;
  dias_funcionamento: string[];
  empresa: {
    slug: string;
    subcategorias: Array<{
      subcategorias_empresas_id: {
        id: string;
        nome: string;
        slug: string;
      };
    }>;
  };
  // Campos de horário de funcionamento
  abertura_segunda?: string | null;
  fechamento_segunda?: string | null;
  abertura_terca?: string | null;
  fechamento_terca?: string | null;
  abertura_quarta?: string | null;
  fechamento_quarta?: string | null;
  abertura_quinta?: string | null;
  fechamento_quinta?: string | null;
  abertura_sexta?: string | null;
  fechamento_sexta?: string | null;
  abertura_sabado?: string | null;
  fechamento_sabado?: string | null;
  abertura_domingo?: string | null;
  fechamento_domingo?: string | null;
}
