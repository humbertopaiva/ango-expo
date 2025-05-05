// Path: src/utils/business-hours.utils.ts

import { CompanyProfile } from "../features/company-page/models/company-profile";

/**
 * Verifica se o estabelecimento está aberto no momento atual
 * Com tratamento adicional de erros
 */
export function isBusinessOpen(profile: CompanyProfile): boolean {
  try {
    if (
      !profile.dias_funcionamento ||
      profile.dias_funcionamento.length === 0
    ) {
      return false;
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 6 = Sábado
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Mapear o dia da semana em JavaScript para o formato usado na API
    const dayMapping = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const dayKey = dayMapping[currentDay];

    // Verificar se o dia atual está na lista de dias de funcionamento
    if (!profile.dias_funcionamento.includes(dayKey)) {
      return false;
    }

    // Obter o horário de abertura e fechamento para o dia atual
    const openTimeKey = `abertura_${dayKey}` as keyof typeof profile;
    const closeTimeKey = `fechamento_${dayKey}` as keyof typeof profile;

    const openTimeString = profile[openTimeKey] as string | undefined;
    const closeTimeString = profile[closeTimeKey] as string | undefined;

    if (!openTimeString || !closeTimeString) {
      return false;
    }

    // Converter os horários para minutos a partir de meia-noite
    function timeStringToMinutes(timeString: string): number {
      try {
        // Exemplo: "09:00:00" -> 540 minutos (9 horas * 60)
        const parts = timeString.split(":");
        if (parts.length < 2) return 0;

        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (isNaN(hours) || isNaN(minutes)) return 0;

        return hours * 60 + minutes;
      } catch (error) {
        console.error("Erro ao converter horário:", error);
        return 0;
      }
    }

    const openTimeMinutes = timeStringToMinutes(openTimeString);
    const closeTimeMinutes = timeStringToMinutes(closeTimeString);

    // Verificar se o horário atual está dentro do horário de funcionamento
    return (
      currentTimeInMinutes >= openTimeMinutes &&
      currentTimeInMinutes <= closeTimeMinutes
    );
  } catch (error) {
    console.error("Erro ao verificar horário de funcionamento:", error);
    return false; // Em caso de erro, considerar fechado por segurança
  }
}
