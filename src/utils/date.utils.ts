// Path: src/utils/date.utils.ts

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
 * Verifica se uma data é hoje
 * @param date Data a ser verificada
 * @returns true se a data for hoje, false caso contrário
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Formata uma data para exibição relativa (hoje, ontem, etc.)
 * @param date Data a ser formatada
 * @returns String formatada
 */
export const formatRelativeDate = (date: Date): string => {
  if (isToday(date)) {
    return `Hoje, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Verifica se é ontem
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Ontem, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Para outras datas
  return date.toLocaleDateString();
};
