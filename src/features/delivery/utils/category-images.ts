// Path: src/features/delivery/utils/category-images.ts
export const categoryImages: Record<string, string> = {
  pizzarias:
    "https://blog.123milhas.com/wp-content/uploads/2022/07/pizzarias-tematicas-dia-da-pizza-sao-paulo-conexao123.jpg",
  hamburguerias:
    "https://www.minhareceita.com.br/app/uploads/2021/03/shutterstock_1751836019-scaled.jpg",
  sushis:
    "https://djapa.com.br/wp-content/uploads/2024/03/comida-japonesa-para-iniciantes.jpg",
  "acai-e-sorveteria":
    "https://i.pinimg.com/736x/df/df/3e/dfdf3ee35bbb16056d0e54a5f4c43ac1.jpg",
  "cachorro-quente":
    "https://theburgermap.com.br/wp-content/uploads/2024/05/Bacon-Cheese-Dog.png",
  porcoes:
    "https://minhasreceitinhas.com.br/wp-content/uploads/2023/01/Batata-frita-com-calabresa-acebolada-2.png",
};

// Função para obter a imagem com fallback
export function getCategoryImage(slug: string): string | null {
  return categoryImages[slug] || null;
}
