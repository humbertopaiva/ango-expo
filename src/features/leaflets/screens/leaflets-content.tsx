// src/features/leaflets/screens/leaflets-content.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLeafletsContext } from "../contexts/use-leaflets-context";
import { LeafletsList } from "../components/leaflets-list";
import { Plus, Search, AlertCircle } from "lucide-react-native";
import {
  Input,
  InputField,
  Modal,
  AlertText,
  AlertIcon,
} from "@gluestack-ui/themed";
import { Button } from "@gluestack-ui/themed";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { LeafletDetailsModal } from "../components/leaflet-details-modal";

export function LeafletsContent() {
  const vm = useLeafletsContext();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4">
        {/* Header */}
        <ScreenHeader
          title="Encartes"
          subtitle="Gerencie os encartes promocionais da sua loja"
          action={
            vm.leafletCount < 5
              ? {
                  label: "Novo Encarte",
                  icon: Plus,
                  onPress: () => router.push("/(app)/admin/leaflets/new"),
                }
              : undefined
          }
        />

        {/* Alerta de limite atingido */}
        {vm.leafletCount >= 5 && (
          <View className="mb-4 bg-amber-50 p-4 rounded-lg flex-row items-start">
            <AlertCircle size={20} color="#F59E0B" className="mr-2 mt-0.5" />
            <Text className="text-amber-800 flex-1">
              Você atingiu o limite máximo de 5 encartes. Para criar um novo
              encarte, exclua um dos existentes.
            </Text>
          </View>
        )}

        {/* Search */}
        <View className="mb-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={20} color="#6B7280" />
            </View>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                placeholder="Buscar encartes..."
                value={vm.searchTerm}
                onChangeText={vm.setSearchTerm}
                className="pl-10"
              />
            </Input>
          </View>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <LeafletsList
            leaflets={vm.leaflets}
            isLoading={vm.isLoading}
            onEdit={(leaflet) => {
              router.push(`/(app)/admin/leaflets/${leaflet.id}` as any);
            }}
            onDelete={(leaflet) => vm.handleDeleteLeaflet(leaflet)}
            onView={(leaflet) => vm.handleViewLeaflet(leaflet)}
          />
        </ScrollView>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={vm.isDeleteModalVisible}
          onClose={() => vm.setIsDeleteModalVisible(false)}
        >
          <Modal.Content>
            <Modal.Header>
              <Text className="text-lg font-semibold">Excluir Encarte</Text>
            </Modal.Header>
            <Modal.Body>
              <Text>
                Tem certeza que deseja excluir o encarte "
                {vm.selectedLeaflet?.nome}"? Esta ação não pode ser desfeita.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline"
                onPress={() => vm.setIsDeleteModalVisible(false)}
                disabled={vm.isDeleting}
                className="mr-2"
              >
                <Button.Text>Cancelar</Button.Text>
              </Button>
              <Button
                variant="solid"
                bgColor="$red500"
                onPress={vm.handleConfirmDelete}
                disabled={vm.isDeleting}
              >
                <Button.Text>
                  {vm.isDeleting ? "Excluindo..." : "Excluir"}
                </Button.Text>
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* Leaflet Details Modal */}
        <LeafletDetailsModal
          leaflet={vm.selectedLeaflet}
          isVisible={vm.isViewModalVisible}
          onClose={() => vm.setIsViewModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
