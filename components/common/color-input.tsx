import { View } from "@gluestack-ui/themed";
import { Platform } from "react-native";
import MobileColorPicker from "./mobile-color-picker";

const ColorInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  if (Platform.OS === "web") {
    return (
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 rounded-lg border-gray-200"
          />
        </View>
        <View
          className="w-10 h-10 rounded border"
          style={{ backgroundColor: value }}
        />
      </View>
    );
  }

  return <MobileColorPicker value={value} onChange={onChange} />;
};

export default ColorInput;
