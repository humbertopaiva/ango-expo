// Path: src/components/common/swipeable-card.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Edit, Trash } from "lucide-react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

interface SwipeableCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete: () => void;
  disableEdit?: boolean;
  position?: number;
  hasBadge?: boolean;
  badgeColor?: string;
}

export function SwipeableCard({
  children,
  onEdit,
  onDelete,
  disableEdit = false,
  position,
  hasBadge = true,
  badgeColor = "bg-primary-100",
}: SwipeableCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeThreshold = -80;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // Calculate final position
      let finalPosition = 0;

      // If swiped far enough, show action buttons
      if (nativeEvent.translationX < swipeThreshold) {
        finalPosition = disableEdit ? -80 : -150;
      }

      Animated.spring(translateX, {
        toValue: finalPosition,
        useNativeDriver: true,
        bounciness: 10,
      }).start();
    }
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <GestureHandlerRootView style={{ marginBottom: 12 }}>
      <View className="overflow-hidden relative">
        {/* Action buttons */}
        <View className="absolute right-0 top-0 bottom-0 flex-row items-center justify-center h-full">
          {!disableEdit && (
            <TouchableOpacity
              onPress={() => {
                resetPosition();
                if (onEdit) onEdit();
              }}
              className="bg-gray-100 h-full w-16 items-center justify-center"
            >
              <Edit size={20} color="#374151" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              resetPosition();
              onDelete();
            }}
            className="bg-red-100 h-full w-16 items-center justify-center"
          >
            <Trash size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Swipeable Card */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [-300, 0],
                    outputRange: [disableEdit ? -80 : -150, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              {/* Position badge */}
              {hasBadge && position && (
                <View
                  className={`absolute top-0 right-0 ${badgeColor} rounded-bl-lg px-1.5 py-0.5 z-10`}
                >
                  <Text className="text-xs font-bold text-primary-700">
                    #{position}
                  </Text>
                </View>
              )}

              {/* Card content */}
              {children}
            </Card>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}
