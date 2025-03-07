// Path: src/features/delivery/models/delivery-showcase-item.ts
export interface DeliveryShowcaseItem {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string;
  preco_promocional: string | null;
  imagem: string | null;
  disponivel: boolean;
  ordem_vitrine?: number;
  empresa: {
    id: string;
    nome: string;
    slug: string;
  };
}
