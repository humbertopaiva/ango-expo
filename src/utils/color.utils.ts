// Path: src/utils/color.utils.ts

/**
 * Determina se uma cor de fundo requer texto claro (branco) ou escuro (preto)
 * baseado na luminosidade da cor.
 *
 * @param backgroundColor Cor de fundo em formato hexadecimal (#RRGGBB)
 * @returns true se o texto deve ser escuro, false se deve ser claro (branco)
 */
export function shouldUseDarkText(backgroundColor: string): boolean {
  // Se não tiver uma cor definida, usar texto escuro por padrão
  if (!backgroundColor || !backgroundColor.startsWith("#")) return true;

  // Converter hexadecimal para RGB
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // Calcular luminosidade percebida
  // Fórmula: https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Se luminosidade > 0.6, a cor é considerada clara e deve usar texto escuro
  return luminance > 0.6;
}

/**
 * Obtém a cor de texto adequada (branco ou cinza escuro)
 * para um determinado fundo.
 *
 * @param backgroundColor Cor de fundo em formato hexadecimal (#RRGGBB)
 * @returns Classe CSS para a cor do texto
 */
export function getContrastText(backgroundColor: string): string {
  return shouldUseDarkText(backgroundColor) ? "text-gray-800" : "text-white";
}

/**
 * Retorna o código de cor para texto baseado na cor de fundo
 *
 * @param backgroundColor Cor de fundo em formato hexadecimal (#RRGGBB)
 * @returns Código de cor hexadecimal adequado para contraste
 */
export function getContrastColor(backgroundColor: string): string {
  return shouldUseDarkText(backgroundColor) ? "#1F2937" : "#FFFFFF";
}
