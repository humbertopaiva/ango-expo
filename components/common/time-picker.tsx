// time-picker.tsx
import React, { useState, useRef, useEffect } from "react";
import { Platform, View, Text, Pressable, Modal, Animated } from "react-native";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  isInvalid?: boolean;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const formatNumber = (number: number): string => {
  return number.toString().padStart(2, "0");
};

const MobileTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
  isInvalid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHour, setCurrentHour] = useState(parseInt(value.split(":")[0]));
  const [currentMinute, setCurrentMinute] = useState(
    parseInt(value.split(":")[1])
  );

  const hours = range(0, 23);
  const minutes = range(0, 59);

  const scrollYHour = useRef(new Animated.Value(0)).current;
  const scrollYMinute = useRef(new Animated.Value(0)).current;

  const getSelectedIndex = (y: number) => {
    return Math.round(y / ITEM_HEIGHT);
  };

  const handleScroll = (y: number, max: number) => {
    const selectedIndex = getSelectedIndex(y);
    if (selectedIndex < 0 || selectedIndex >= max) return 0;
    return selectedIndex;
  };

  const snapToItem = (y: Animated.Value, index: number) => {
    Animated.spring(y, {
      toValue: index * ITEM_HEIGHT,
      useNativeDriver: true,
    }).start();
  };

  const onConfirm = () => {
    const newTime = `${formatNumber(currentHour)}:${formatNumber(
      currentMinute
    )}`;
    onChange(newTime);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const hourIndex = hours.indexOf(currentHour);
      const minuteIndex = minutes.indexOf(currentMinute);
      snapToItem(scrollYHour, hourIndex);
      snapToItem(scrollYMinute, minuteIndex);
    }
  }, [isOpen]);

  const renderPickerItems = (
    items: number[],
    scrollY: Animated.Value,
    onMomentumEnd: (y: number) => void
  ) => {
    return (
      <View className="h-[200px] overflow-hidden">
        <Animated.View
          className="absolute left-0 right-0"
          style={{
            transform: [{ translateY: Animated.multiply(scrollY, -1) }],
          }}
        >
          {items.map((item, index) => {
            const inputRange = [
              (index - 2) * ITEM_HEIGHT,
              (index - 1) * ITEM_HEIGHT,
              index * ITEM_HEIGHT,
              (index + 1) * ITEM_HEIGHT,
              (index + 2) * ITEM_HEIGHT,
            ];

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [0.7, 0.8, 1, 0.8, 0.7],
            });

            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0.3, 0.5, 1, 0.5, 0.3],
            });

            return (
              <Animated.View
                key={item}
                className="h-[40px] items-center justify-center"
                style={{
                  transform: [{ scale }],
                  opacity,
                }}
              >
                <Text className="text-lg">{formatNumber(item)}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>
        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            onMomentumEnd(y);
          }}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: ((VISIBLE_ITEMS - 1) * ITEM_HEIGHT) / 2,
          }}
        >
          {items.map((_, idx) => (
            <View key={`space-${idx}`} className="h-[40px]" />
          ))}
        </Animated.ScrollView>
      </View>
    );
  };

  return (
    <>
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        className={`h-10 px-3 rounded-md flex-row items-center justify-between ${
          disabled ? "bg-gray-100" : "bg-white"
        } ${isInvalid ? "border-red-500" : "border-gray-200"} border`}
        disabled={disabled}
      >
        <Text className={`${disabled ? "text-gray-400" : "text-gray-900"}`}>
          {value}
        </Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Pressable onPress={() => setIsOpen(false)}>
                <Text className="text-blue-500">Cancelar</Text>
              </Pressable>
              <Text className="font-medium">Selecionar Horário</Text>
              <Pressable onPress={onConfirm}>
                <Text className="text-blue-500">OK</Text>
              </Pressable>
            </View>

            <View className="flex-row justify-center items-center p-4">
              <View className="flex-1">
                {renderPickerItems(hours, scrollYHour, (y) => {
                  const selectedHour = handleScroll(y, 24);
                  setCurrentHour(selectedHour);
                })}
              </View>
              <Text className="text-xl px-2">:</Text>
              <View className="flex-1">
                {renderPickerItems(minutes, scrollYMinute, (y) => {
                  const selectedMinute = handleScroll(y, 60);
                  setCurrentMinute(selectedMinute);
                })}
              </View>
            </View>

            <View className="absolute pointer-events-none left-0 right-0 top-1/2 -translate-y-[20px] h-[40px] border-t border-b border-gray-200 bg-gray-50/50" />
          </View>
        </View>
      </Modal>
    </>
  );
};

const WebTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
  isInvalid,
}) => {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`h-10 px-3 rounded-md border ${
        disabled ? "bg-gray-100" : "bg-white"
      } ${isInvalid ? "border-red-500" : "border-gray-200"}`}
    />
  );
};

export const TimePicker: React.FC<TimePickerProps> = (props) => {
  return Platform.OS === "web" ? (
    <WebTimePicker {...props} />
  ) : (
    <MobileTimePicker {...props} />
  );
};
