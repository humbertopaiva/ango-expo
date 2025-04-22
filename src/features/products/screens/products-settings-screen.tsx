// Path: src/features/products/screens/products-settings-screen.tsx
import React from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { SectionCard } from "@/components/custom/section-card";
import { Settings, ShoppingBag, Layers, Tag } from "lucide-react-native";
import { router } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";
import { FormActions } from "@/components/custom/form-actions";
import { useToast } from "@gluestack-ui/themed";
import { showSuccessToast } from "@/components/common/toast-helper";

export function ProductsSettingsScreen() {
  const toast = useToast();

  // Em uma implementação real, estas configurações viriam de um serviço ou store
  const [showStock, setShowStock] = React.useState(true);
  const [enableVariations, setEnableVariations] = React.useState(true);
  const [showPrices, setShowPrices] = React.useState(true);

  const handleSave = () => {
    // Aqui você salvaria as configurações em um serviço ou API
    showSuccessToast(toast, "Configurações salvas com sucesso!");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader
        title="Configurações de Produto"
        backTo="/admin/products"
      />

      <ScrollView className="flex-1 p-4">
        <SectionCard
          title="Configurações Gerais"
          icon={<Settings size={22} color="#0891B2" />}
        >
          <View className="py-4 space-y-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-800">
                  Exibir estoque
                </Text>
                <Text className="text-gray-500 text-sm">
                  Mostra a quantidade em estoque para os clientes
                </Text>
              </View>
              <Switch
                value={showStock}
                onValueChange={setShowStock}
                trackColor={{ false: "#d1d5db", true: THEME_COLORS.primary }}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-800">
                  Habilitar variações
                </Text>
                <Text className="text-gray-500 text-sm">
                  Permite criar produtos com tamanhos, cores, etc.
                </Text>
              </View>
              <Switch
                value={enableVariations}
                onValueChange={setEnableVariations}
                trackColor={{ false: "#d1d5db", true: THEME_COLORS.primary }}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-medium text-gray-800">Exibir preços</Text>
                <Text className="text-gray-500 text-sm">
                  Mostra os preços dos produtos para os clientes
                </Text>
              </View>
              <Switch
                value={showPrices}
                onValueChange={setShowPrices}
                trackColor={{ false: "#d1d5db", true: THEME_COLORS.primary }}
              />
            </View>
          </View>
        </SectionCard>

        <SectionCard
          title="Atalhos Rápidos"
          icon={<ShoppingBag size={22} color="#0891B2" />}
        >
          <View className="py-4 space-y-4">
            <TouchableOpacity
              className="p-4 bg-gray-50 rounded-lg flex-row items-center"
              onPress={() => router.push("/admin/products/list")}
            >
              <ShoppingBag size={20} color={THEME_COLORS.primary} />
              <Text className="ml-3 font-medium text-gray-800">
                Gerenciar Produtos
              </Text>
              <View className="flex-1" />
              <Text className="text-primary-500">Ver →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 bg-gray-50 rounded-lg flex-row items-center"
              onPress={() => router.push("/admin/products/variations/types")}
            >
              <Tag size={20} color={THEME_COLORS.primary} />
              <Text className="ml-3 font-medium text-gray-800">
                Gerenciar Variações
              </Text>
              <View className="flex-1" />
              <Text className="text-primary-500">Ver →</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>
      </ScrollView>

      <View className="bg-white border-t border-gray-200 p-4">
        <FormActions
          primaryAction={{
            label: "Salvar Configurações",
            onPress: handleSave,
          }}
          secondaryAction={{
            label: "Cancelar",
            onPress: () => router.back(),
            variant: "outline",
          }}
        />
      </View>
    </SafeAreaView>
  );
}
