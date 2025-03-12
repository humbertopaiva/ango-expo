// Path: src/utils/format.utils.ts

/**
 * Formatar valor monetário para exibição
 * @param value Valor numérico a ser formatado
 * @returns String formatada como moeda brasileira (R$)
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Formatar número de telefone brasileiro
 * Aceita entrada apenas com números e formata para (XX) XXXXX-XXXX
 * @param phone Número de telefone (apenas dígitos)
 * @returns Número formatado ou string vazia se inválido
 */
export function formatPhoneNumber(phone: string): string {
  // Manter apenas dígitos
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  // Formato DDD + 9 dígitos (XX) XXXXX-XXXX
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.substring(0, 2)}) ${digits.substring(
      2,
      6
    )}-${digits.substring(6)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(
      2,
      7
    )}-${digits.substring(7, 11)}`;
  }
}

/**
 * Formatar CEP
 * @param cep CEP (apenas dígitos)
 * @returns CEP formatado (XXXXX-XXX)
 */
export function formatCep(cep: string): string {
  // Manter apenas dígitos
  const digits = cep.replace(/\D/g, "");

  if (digits.length <= 5) {
    return digits;
  } else {
    return `${digits.substring(0, 5)}-${digits.substring(5, 8)}`;
  }
}

/**
 * Verifica se um texto parece um endereço de email válido
 * @param email Texto a ser validado como email
 * @returns True se for um formato de email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formatar data no padrão brasileiro (DD/MM/YYYY)
 * @param date Objeto Date a ser formatado
 * @returns Data formatada como string
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formatar horário (HH:MM)
 * @param date Objeto Date a ser formatado
 * @returns Horário formatado como string
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Truncar texto com reticências se exceder o tamanho máximo
 * @param text Texto original
 * @param maxLength Tamanho máximo permitido
 * @returns Texto truncado com reticências ou o texto original
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
