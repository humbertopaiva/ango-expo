// Atualização da função em Path: src/utils/date.utils.ts
// Adicione ou atualize a função formatDateToTimeString:

/**
 * Formata uma string de hora no formato "HH:MM" para exibição
 * @param timeString String no formato "HH:MM"
 * @returns String formatada ou a string original se o formato for inválido
 */
export const formatDateToTimeString = (timeString: string): string => {
  if (!timeString) return "";

  // Verifica se está no formato "HH:MM"
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(timeString)) return timeString;

  try {
    // Cria um objeto Date com a hora atual, mas substitui a hora e minutos
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Formata para o formato local (12h ou 24h dependendo da configuração do sistema)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    console.error("Erro ao formatar hora:", error);
    return timeString;
  }
};

/**
 * Formata uma data no padrão brasileiro (DD/MM/YYYY)
 * @param dateString String representando uma data válida
 * @returns Data formatada no padrão brasileiro
 */
export const formatToBrazilianDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return dateString;
    }

    // Formato brasileiro: dia/mês/ano
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString; // Retorna a string original em caso de erro
  }
};
