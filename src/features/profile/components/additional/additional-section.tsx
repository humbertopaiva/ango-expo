import React from "react";
import { View, Text } from "react-native";
import { Edit3, Tag, Info } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdditionalForm } from "./additional-form";
import { useProfileContext } from "../../contexts/use-profile-context";

export function AdditionalSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  return (
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">
              Informações Adicionais
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsAdditionalOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4 space-y-6">
          {/* Adicionais */}
          <View className="space-y-4">
            <View className="flex-row items-center space-x-2">
              <Info size={20} color="#6B7280" />
              <Text className="font-medium">Informações Extras</Text>
            </View>

            {vm.profile.adicionais && vm.profile.adicionais.length > 0 ? (
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vm.profile.adicionais.map((adicional, index) => (
                  <View
                    key={index}
                    className="p-4 rounded-lg border bg-card space-y-1"
                  >
                    <Text className="font-medium">{adicional.titulo}</Text>
                    <Text className="text-sm text-gray-500">
                      {adicional.valor}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-500">
                Nenhuma informação adicional cadastrada.
              </Text>
            )}
          </View>

          {/* Tags */}
          <View className="space-y-4">
            <View className="flex-row items-center space-x-2">
              <Tag size={20} color="#6B7280" />
              <Text className="font-medium">Tags</Text>
            </View>

            {vm.profile.tags && vm.profile.tags.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {vm.profile.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-500">
                Nenhuma tag cadastrada.
              </Text>
            )}
          </View>
        </View>
      </Card>

      <AdditionalForm
        open={vm.isAdditionalOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateAdditional}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
