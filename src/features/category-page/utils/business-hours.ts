// Path: src/features/category-page/utils/business-hours.ts
export function isBusinessOpen(perfil: any): boolean {
  if (!perfil) return false;

  // Obter o dia atual (0 = domingo, 1 = segunda, etc.)
  const daysOfWeek = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay()];

  // Verificar se o estabelecimento funciona hoje
  if (
    !perfil.dias_funcionamento ||
    !perfil.dias_funcionamento.includes(currentDayName)
  ) {
    return false;
  }

  // Obter a hora atual no formato HH:MM:SS
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const currentSeconds = today.getSeconds();

  // Obter os horários de abertura e fechamento para o dia atual
  const openingTimeKey = `abertura_${currentDayName}`;
  const closingTimeKey = `fechamento_${currentDayName}`;

  // Verificar se os horários existem
  if (!perfil[openingTimeKey] || !perfil[closingTimeKey]) {
    return false;
  }

  // Converter horários para comparação
  const [openHour, openMinute, openSecond] = perfil[openingTimeKey]
    .split(":")
    .map(Number);
  const [closeHour, closeMinute, closeSecond] = perfil[closingTimeKey]
    .split(":")
    .map(Number);

  // Converter tudo para segundos para facilitar a comparação
  const currentTimeInSeconds =
    currentHour * 3600 + currentMinutes * 60 + currentSeconds;
  const openTimeInSeconds = openHour * 3600 + openMinute * 60 + openSecond;
  const closeTimeInSeconds = closeHour * 3600 + closeMinute * 60 + closeSecond;

  // Verificar se o horário atual está dentro do horário de funcionamento
  return (
    currentTimeInSeconds >= openTimeInSeconds &&
    currentTimeInSeconds <= closeTimeInSeconds
  );
}

// Função auxiliar para formatar horários em um formato mais amigável
export function formatBusinessHours(perfil: any): string {
  if (
    !perfil ||
    !perfil.dias_funcionamento ||
    !perfil.dias_funcionamento.length
  ) {
    return "Horário não disponível";
  }

  const daysOfWeek = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay()];

  // Verificar se o estabelecimento funciona hoje
  if (perfil.dias_funcionamento.includes(currentDayName)) {
    const openingTimeKey = `abertura_${currentDayName}`;
    const closingTimeKey = `fechamento_${currentDayName}`;

    if (perfil[openingTimeKey] && perfil[closingTimeKey]) {
      const openingTime = perfil[openingTimeKey].substring(0, 5);
      const closingTime = perfil[closingTimeKey].substring(0, 5);
      return `Hoje: ${openingTime} - ${closingTime}`;
    }
  }

  // Se não funciona hoje, mostrar o próximo dia de funcionamento
  const currentDayIndex = today.getDay();
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDayName = daysOfWeek[nextDayIndex];

    if (perfil.dias_funcionamento.includes(nextDayName)) {
      const openingTimeKey = `abertura_${nextDayName}`;
      const closingTimeKey = `fechamento_${nextDayName}`;

      if (perfil[openingTimeKey] && perfil[closingTimeKey]) {
        const nextDayLabel =
          nextDayName.charAt(0).toUpperCase() + nextDayName.slice(1);
        const openingTime = perfil[openingTimeKey].substring(0, 5);
        const closingTime = perfil[closingTimeKey].substring(0, 5);
        return `${nextDayLabel}: ${openingTime} - ${closingTime}`;
      }
    }
  }

  return "Horário não disponível";
}
