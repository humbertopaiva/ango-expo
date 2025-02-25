import React from "react";
import { StatusBar, View } from "react-native";
import Constants from "expo-constants";

interface CustomStatusBarProps {
  backgroundColor: string;
  [key: string]: any;
}

export const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  backgroundColor,
  ...props
}) => {
  return (
    <>
      <View
        style={{
          height: Constants.statusBarHeight,
          backgroundColor,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      />
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </>
  );
};
