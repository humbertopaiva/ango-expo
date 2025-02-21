import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Edit3, Image as ImageIcon } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useProfileContext } from "../../contexts/use-profile-context";
import { Image } from "@/components/ui/image";
import { BasicInfoForm } from "./basic-info-form";

export function BasicInfoSection() {
  const vm = useProfileContext();

  if (!vm.profile) return null;

  return (
    <View className="space-y-6">
      <Card>
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Informações Básicas</Text>
            <Button
              variant="outline"
              size="sm"
              onPress={() => vm.setIsBasicInfoOpen(true)}
            >
              <Edit3 size={16} color="#000000" className="mr-2" />
              <Text>Editar</Text>
            </Button>
          </View>
        </View>

        <View className="p-4 space-y-6">
          {/* Logo e Banner */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View className="space-y-2">
              <Text className="text-sm font-medium">Logo</Text>
              <View className="h-40 rounded-lg border bg-gray-100 items-center justify-center">
                {vm.profile.logo ? (
                  <Image
                    source={{ uri: vm.profile.logo }}
                    className="h-full w-full rounded-lg"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="items-center">
                    <ImageIcon size={32} color="#6B7280" />
                    <Text className="text-sm text-gray-500 mt-2">Sem logo</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-sm font-medium">Banner</Text>
              <View className="h-40 rounded-lg border bg-gray-100 items-center justify-center">
                {vm.profile.banner ? (
                  <Image
                    source={{ uri: vm.profile.banner }}
                    className="h-full w-full rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="items-center">
                    <ImageIcon size={32} color="#6B7280" />
                    <Text className="text-sm text-gray-500 mt-2">
                      Sem banner
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Informações */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium mb-1">Status</Text>
              <Badge
                variant={vm.profile.status === "ativo" ? "solid" : "outline"}
              >
                {vm.profile.status === "ativo" ? "Ativo" : "Inativo"}
              </Badge>
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">Nome da Empresa</Text>
              <Text className="text-base">{vm.profile.nome}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium mb-1">Descrição</Text>
              <Text className="text-base">{vm.profile.descricao}</Text>
            </View>

            <View className="text-sm text-gray-500">
              <Text>
                Criado em:{" "}
                {new Date(vm.profile.date_created).toLocaleDateString()}
              </Text>
              {vm.profile.date_updated && (
                <Text>
                  Última atualização:{" "}
                  {new Date(vm.profile.date_updated).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Card>

      <BasicInfoForm
        open={vm.isBasicInfoOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleUpdateBasicInfo}
        isLoading={vm.isUpdating}
        profile={vm.profile}
      />
    </View>
  );
}
