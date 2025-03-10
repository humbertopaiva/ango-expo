// Path: src/utils/business-hours.utils.ts
import { CompanyProfile } from "../features/company-page/models/company-profile";

export interface DaySchedule {
  day: string;
  dayName: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

/**
 * Formata o horário no formato "HH:MM:SS" para "HH:MM"
 */
function formatTimeString(timeString?: string): string {
  if (!timeString) return "";

  // Se for no formato "HH:MM:SS", remove os segundos
  if (timeString.includes(":")) {
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}`;
  }

  return timeString;
}

/**
 * Converte os campos individuais de horário em um objeto estruturado
 * para facilitar exibição e manipulação
 */
export function getBusinessHoursFormatted(
  profile: CompanyProfile
): DaySchedule[] {
  const days = [
    { key: "domingo", name: "Domingo" },
    { key: "segunda", name: "Segunda-feira" },
    { key: "terca", name: "Terça-feira" },
    { key: "quarta", name: "Quarta-feira" },
    { key: "quinta", name: "Quinta-feira" },
    { key: "sexta", name: "Sexta-feira" },
    { key: "sabado", name: "Sábado" },
  ];

  return days.map((day) => {
    const isOpenDay = profile.dias_funcionamento?.includes(day.key) || false;
    const openTimeKey = `abertura_${day.key}` as keyof typeof profile;
    const closeTimeKey = `fechamento_${day.key}` as keyof typeof profile;

    // Acesse como strings (já que sabemos que estamos procurando campos específicos)
    const openTime = profile[openTimeKey] as string | undefined;
    const closeTime = profile[closeTimeKey] as string | undefined;

    return {
      day: day.key,
      dayName: day.name,
      isOpen: isOpenDay,
      openTime: isOpenDay ? formatTimeString(openTime) : undefined,
      closeTime: isOpenDay ? formatTimeString(closeTime) : undefined,
    };
  });
}

/**
 * Verifica se o estabelecimento está aberto no momento atual
 */
export function isBusinessOpen(profile: CompanyProfile): boolean {
  if (!profile.dias_funcionamento || profile.dias_funcionamento.length === 0) {
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
    // Exemplo: "09:00:00" -> 540 minutos (9 horas * 60)
    const parts = timeString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }

  const openTimeMinutes = timeStringToMinutes(openTimeString);
  const closeTimeMinutes = timeStringToMinutes(closeTimeString);

  // Verificar se o horário atual está dentro do horário de funcionamento
  return (
    currentTimeInMinutes >= openTimeMinutes &&
    currentTimeInMinutes <= closeTimeMinutes
  );
}
