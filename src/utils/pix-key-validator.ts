// Path: src/utils/pix-key-validator.ts

/**
 * Utilitário para validar chaves PIX com base em seu tipo
 */
export const pixKeyValidator = {
  /**
   * Valida uma chave PIX de acordo com seu tipo
   * @param key Chave a ser validada
   * @param type Tipo da chave (cpf-cnpj, email, telefone, aleatoria)
   * @returns Verdadeiro se a chave for válida para o tipo especificado
   */
  validate(key: string, type: string): boolean {
    if (!key) return false;

    switch (type) {
      case "cpf-cnpj":
        return this.validateCpfCnpj(key);
      case "email":
        return this.validateEmail(key);
      case "telefone":
        return this.validatePhone(key);
      case "aleatoria":
        return this.validateRandomKey(key);
      default:
        return false;
    }
  },

  /**
   * Valida um CPF ou CNPJ
   * Implementação simplificada, apenas verificando formato numérico
   */
  validateCpfCnpj(value: string): boolean {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Verifica se é um CPF (11 dígitos) ou CNPJ (14 dígitos)
    return numbers.length === 11 || numbers.length === 14;
  },

  /**
   * Valida um endereço de email
   */
  validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Valida um número de telefone
   */
  validatePhone(value: string): boolean {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Verifica se tem pelo menos 10 dígitos (DDD + número)
    return numbers.length >= 10 && numbers.length <= 15;
  },

  /**
   * Valida uma chave aleatória
   */
  validateRandomKey(value: string): boolean {
    // Chave aleatória deve ter entre 32 e 36 caracteres
    return value.length >= 32 && value.length <= 36;
  },
};
