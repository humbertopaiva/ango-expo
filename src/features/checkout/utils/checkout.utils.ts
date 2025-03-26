// Path: src/features/checkout/utils/checkout.utils.ts

/**
 * Aplicar máscara de telefone no formato (99) 9 9999-9999
 * @param phone Número de telefone (apenas dígitos)
 * @returns Número formatado ou string vazia se vazio
 */
export function maskPhoneNumber(phone: string): string {
  // Se o valor for vazio ou undefined, retorna string vazia
  if (!phone) return "";

  // Remover qualquer caracter não numérico
  const numericValue = phone.replace(/\D/g, "");

  // Se não tiver dígitos, retorna string vazia
  if (numericValue.length === 0) return "";

  // Aplicar máscara dependendo do comprimento
  if (numericValue.length <= 2) {
    return `(${numericValue}`;
  } else if (numericValue.length <= 3) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
  } else if (numericValue.length <= 7) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3)}`;
  } else if (numericValue.length <= 11) {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
  } else {
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(
      2,
      3
    )} ${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
  }
}
