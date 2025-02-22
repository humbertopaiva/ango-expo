import {
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
} from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { Pressable, Modal } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

const MobileColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);

  const handleConfirm = () => {
    onChange(tempColor);
    setIsVisible(false);
  };

  const handleHexInput = (text: string) => {
    // Remove espaços e caracteres inválidos
    let formattedValue = text.replace(/[^A-Fa-f0-9#]/g, "");

    // Adiciona # se não existir
    if (!formattedValue.startsWith("#")) {
      formattedValue = "#" + formattedValue;
    }

    // Limita o tamanho do HEX
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7);
    }

    setHexInput(formattedValue);

    // Só atualiza a cor se for um hex válido
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formattedValue)) {
      setTempColor(formattedValue);
    }
  };

  // Atualiza o input hex quando a cor muda pelo picker
  useEffect(() => {
    setHexInput(tempColor);
  }, [tempColor]);

  return (
    <>
      <Pressable
        onPress={() => setIsVisible(true)}
        className="flex-row items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
      >
        <View className="flex-1">
          <Text className="text-gray-600">{value}</Text>
        </View>
        <View
          className="w-10 h-10 rounded-lg shadow"
          style={{ backgroundColor: value }}
        />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-96">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-medium">Escolher Cor</Text>
              <View
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: tempColor }}
              />
            </View>

            {/* Input Hex */}
            <View className="mb-4">
              <View className="flex-row items-center space-x-2">
                <View className="flex-1">
                  <Input>
                    <InputField
                      placeholder="#000000"
                      value={hexInput}
                      onChangeText={handleHexInput}
                      maxLength={7}
                    />
                  </Input>
                </View>
                <View
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: tempColor }}
                />
              </View>
            </View>

            <View className="flex-1 mb-6">
              <ColorPicker
                color={tempColor}
                onColorChange={(color) => {
                  setTempColor(color);
                  setHexInput(color);
                }}
                thumbSize={40}
                sliderSize={40}
                noSnap={true}
                row={false}
              />
            </View>

            <View className="flex-row space-x-4">
              <Button
                variant="outline"
                onPress={() => setIsVisible(false)}
                className="flex-1"
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button onPress={handleConfirm} className="flex-1">
                <ButtonText>Confirmar</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MobileColorPicker;
