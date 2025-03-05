export interface DeliveryShowcaseProduct {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string;
  preco_promocional: string | null;
  imagem: string | null;
  empresa: {
    id: string;
    nome: string;
    slug: string;
  };
}
