// src/components/common/date-picker.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  Button,
  Icon,
  Box,
  VStack,
  HStack,
  Divider,
} from "@gluestack-ui/themed";
import {
  format,
  parse,
  addMonths,
  subMonths,
  setDate,
  isValid,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react-native";

interface DatePickerProps {
  value: string; // Formato ISO: YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  labelText?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  isInvalid = false,
  errorMessage,
  disabled = false,
  minDate,
  maxDate,
  labelText,
}: DatePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [tempDate, setTempDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [calendarView, setCalendarView] = useState<Date>(new Date());

  // Atualiza o estado interno quando o valor da prop muda
  useEffect(() => {
    if (value) {
      try {
        const parsedDate = new Date(value);
        if (isValid(parsedDate)) {
          setCurrentDate(parsedDate);
          setTempDate(parsedDate);
          if (!calendarView.getTime()) {
            setCalendarView(parsedDate);
          }
        }
      } catch (e) {
        console.error("Data inválida:", value);
      }
    } else {
      setCurrentDate(null);
      setTempDate(null);
    }
  }, [value]);

  // Formata a data para exibição
  const getDisplayDate = () => {
    if (!currentDate) return "";
    try {
      return format(currentDate, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "";
    }
  };

  // Confirma a seleção da data
  const confirmSelection = () => {
    if (tempDate) {
      setCurrentDate(tempDate);
      onChange(format(tempDate, "yyyy-MM-dd"));
    }
    setIsModalVisible(false);
  };

  // Cancela a seleção
  const cancelSelection = () => {
    setTempDate(currentDate);
    setIsModalVisible(false);
  };

  // Manipuladores do calendário
  const handlePrevMonth = () => {
    setCalendarView(subMonths(calendarView, 1));
  };

  const handleNextMonth = () => {
    setCalendarView(addMonths(calendarView, 1));
  };

  const handleDatePress = (date: Date) => {
    setTempDate(date);
    if (Platform.OS !== "web") {
      // No mobile, podemos confirmar automaticamente para experiência mais rápida
      setCurrentDate(date);
      onChange(format(date, "yyyy-MM-dd"));
      setIsModalVisible(false);
    }
  };

  // Gera os dias do mês atual para o calendário
  const generateCalendarDays = () => {
    const daysInMonth = new Date(
      calendarView.getFullYear(),
      calendarView.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      calendarView.getFullYear(),
      calendarView.getMonth(),
      1
    ).getDay();

    // Ajuste para começar a semana no domingo (0) ou segunda (1)
    const startDay = 0; // 0 para domingo, 1 para segunda
    const adjustedFirstDay = (firstDayOfMonth - startDay + 7) % 7;

    const days = [];

    // Dias do mês anterior
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        calendarView.getFullYear(),
        calendarView.getMonth(),
        i
      );
      days.push(date);
    }

    return days;
  };

  // Componente para Web - Adaptado para compatibilidade com Gluestack
  if (Platform.OS === "web") {
    // Estado local para controlar o calendário popover na web
    const [showWebCalendar, setShowWebCalendar] = useState(false);

    // Função para manipular clique fora do calendário (para fechá-lo)
    const handleOutsideClick = (e: any) => {
      if (e.target.closest(".date-picker-calendar-container") === null) {
        setShowWebCalendar(false);
      }
    };

    // Adiciona e remove event listener para detectar cliques fora do calendário
    useEffect(() => {
      if (showWebCalendar) {
        document.addEventListener("mousedown", handleOutsideClick);
      } else {
        document.removeEventListener("mousedown", handleOutsideClick);
      }

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [showWebCalendar]);

    return (
      <VStack space="xs">
        {labelText && (
          <Text className="text-sm font-medium text-gray-700">{labelText}</Text>
        )}
        <View className="relative">
          {/* Input de exibição da data formatada */}
          <TouchableOpacity
            onPress={() => !disabled && setShowWebCalendar(!showWebCalendar)}
            className={`px-3 py-2 h-10 flex-row items-center justify-between rounded-md border ${
              isInvalid ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100" : "bg-white"}`}
            disabled={disabled}
          >
            <Text
              className={`${!currentDate ? "text-gray-400" : "text-gray-800"}`}
            >
              {currentDate ? getDisplayDate() : placeholder}
            </Text>
            <Calendar size={18} color={disabled ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>

          {/* Calendário popup para Web */}
          {showWebCalendar && !disabled && (
            <View
              className="absolute top-12 left-0 z-10 bg-white shadow-lg rounded-md border border-gray-200 w-64 date-picker-calendar-container"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
            >
              {/* Navegação do Calendário */}
              <HStack className="justify-between items-center p-2 border-b border-gray-200">
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft size={16} color="#6B7280" />
                </TouchableOpacity>

                <Text className="text-sm font-medium text-gray-800">
                  {format(calendarView, "MMMM yyyy", { locale: ptBR })}
                </Text>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight size={16} color="#6B7280" />
                </TouchableOpacity>
              </HStack>

              {/* Dias da Semana */}
              <HStack className="justify-between px-2 py-1">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                  <Text
                    key={index}
                    className="text-center font-medium text-gray-500 text-xs flex-1"
                  >
                    {day}
                  </Text>
                ))}
              </HStack>

              {/* Dias do Mês */}
              <View className="flex-row flex-wrap p-1">
                {generateCalendarDays().map((date, index) => {
                  if (!date) {
                    return (
                      <View key={`empty-${index}`} className="w-8 h-8 m-0.5" />
                    );
                  }

                  const isSelected =
                    currentDate && isSameDay(date, currentDate);
                  const isToday = isSameDay(date, new Date());
                  const isDisabledDate =
                    (minDate && date < minDate) || (maxDate && date > maxDate);

                  return (
                    <TouchableOpacity
                      key={`day-${index}`}
                      className={`w-8 h-8 m-0.5 items-center justify-center rounded-full
                        ${
                          isSelected
                            ? "bg-blue-500"
                            : isToday
                            ? "bg-blue-100"
                            : "hover:bg-gray-100"
                        }
                        ${
                          isDisabledDate
                            ? "opacity-30 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                      onPress={() => {
                        if (!isDisabledDate) {
                          handleDatePress(date);
                          setCurrentDate(date);
                          onChange(format(date, "yyyy-MM-dd"));
                          setShowWebCalendar(false);
                        }
                      }}
                      disabled={isDisabledDate}
                    >
                      <Text
                        className={`text-xs
                          ${
                            isSelected
                              ? "text-white font-bold"
                              : isToday
                              ? "font-medium"
                              : "text-gray-800"
                          }
                          ${isDisabledDate ? "text-gray-400" : ""}
                        `}
                      >
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Botão para usar hoje */}
              <TouchableOpacity
                className="p-2 m-1 border-t border-gray-200 items-center"
                onPress={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  onChange(format(today, "yyyy-MM-dd"));
                  setShowWebCalendar(false);
                }}
              >
                <Text className="text-sm text-blue-500 font-medium">Hoje</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {isInvalid && errorMessage && (
          <Text className="text-xs text-red-500 mt-1">{errorMessage}</Text>
        )}
      </VStack>
    );
  }

  // Componente para Mobile - Com calendário visual melhorado
  return (
    <VStack space="xs">
      {labelText && (
        <Text className="text-sm font-medium text-gray-700">{labelText}</Text>
      )}
      <TouchableOpacity
        onPress={() => !disabled && setIsModalVisible(true)}
        className={`px-3 py-3 flex-row items-center justify-between rounded-lg border ${
          isInvalid ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100" : "bg-white"}`}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          className={`${
            !currentDate ? "text-gray-400" : "text-gray-800"
          } text-base`}
        >
          {currentDate ? getDisplayDate() : placeholder}
        </Text>
        <Calendar size={20} color={disabled ? "#9CA3AF" : "#6B7280"} />
      </TouchableOpacity>

      {isInvalid && errorMessage && (
        <Text className="text-xs text-red-500">{errorMessage}</Text>
      )}

      {/* Modal com calendário visual para Mobile */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={cancelSelection} // Fecha ao clicar no fundo
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-2xl"
          >
            <VStack space="md" className="p-4">
              {/* Cabeçalho do Modal */}
              <HStack className="justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  Selecione uma data
                </Text>
                <TouchableOpacity
                  onPress={cancelSelection}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <X size={18} color="#6B7280" />
                </TouchableOpacity>
              </HStack>

              <Divider />

              {/* Navegação do Calendário */}
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  className="p-2 rounded-full"
                >
                  <ChevronLeft size={24} color="#6B7280" />
                </TouchableOpacity>

                <Text className="text-base font-medium text-gray-800">
                  {format(calendarView, "MMMM yyyy", { locale: ptBR })}
                </Text>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  className="p-2 rounded-full"
                >
                  <ChevronRight size={24} color="#6B7280" />
                </TouchableOpacity>
              </HStack>

              {/* Dias da Semana */}
              <HStack className="justify-between">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day, index) => (
                    <Text
                      key={index}
                      className="text-center font-medium text-gray-500 text-xs flex-1"
                    >
                      {day}
                    </Text>
                  )
                )}
              </HStack>

              {/* Dias do Mês */}
              <View className="flex-row flex-wrap">
                {generateCalendarDays().map((date, index) => {
                  if (!date) {
                    return (
                      <View
                        key={`empty-${index}`}
                        className="w-1/7 aspect-square p-1"
                      />
                    );
                  }

                  const isSelected = tempDate && isSameDay(date, tempDate);
                  const isDisabledDate =
                    (minDate && date < minDate) || (maxDate && date > maxDate);

                  return (
                    <TouchableOpacity
                      key={`day-${index}`}
                      className={`w-1/7 aspect-square p-1 items-center justify-center`}
                      onPress={() => !isDisabledDate && handleDatePress(date)}
                      disabled={isDisabledDate}
                    >
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center
                          ${isSelected ? "bg-blue-500" : "bg-transparent"}
                          ${isDisabledDate ? "opacity-30" : "opacity-100"}
                        `}
                      >
                        <Text
                          className={`
                            ${
                              isSelected
                                ? "text-white font-bold"
                                : "text-gray-800"
                            }
                            ${isDisabledDate ? "text-gray-400" : ""}
                          `}
                        >
                          {date.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Divider />

              {/* Botões de ação */}
              <HStack space="sm" className="justify-end">
                <Button
                  variant="outline"
                  onPress={cancelSelection}
                  className="flex-1"
                >
                  <Button.Text>Cancelar</Button.Text>
                </Button>

                <Button
                  onPress={confirmSelection}
                  className="flex-1"
                  isDisabled={!tempDate}
                >
                  <Button.Text>Confirmar</Button.Text>
                </Button>
              </HStack>
            </VStack>
          </Pressable>
        </Pressable>
      </Modal>
    </VStack>
  );
}
