// Path: src/features/shop-window/pages/vitrine-page-content.tsx

import React, { useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { Text } from "@/components/ui/text";
import ScreenHeader from "@/components/ui/screen-header";
import { VitrineProdutoForm } from "../components/vitrine-produto-form";
import { VitrineLinkForm } from "../components/vitrine-link-form";
import { useVitrineContext } from "../contexts/use-vitrine-context";
import { VitrineLinkList } from "../components/vitrine-link-list";
import { VitrineProdutoList } from "../components/vitrine-produto-list";
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { PrimaryActionButton } from "@/components/common/primary-action-button";
import { THEME_COLORS } from "@/src/styles/colors";
import { useWindowDimensions } from "react-native";

// Tab customizado para melhor design
import type { Route, NavigationState } from "react-native-tab-view";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@gluestack-ui/themed";

interface TabBarProps {
  navigationState: NavigationState<Route>;
  position: any;
  jumpTo: (key: string) => void;
}

const CustomTabBar = ({ navigationState, position, jumpTo }: TabBarProps) => {
  return (
    <View className="flex-row border-b border-gray-200 bg-white">
      {navigationState.routes.map((route, i) => {
        const isActive = navigationState.index === i;
        return (
          <View
            key={route.key}
            style={{
              flex: 1,
              paddingVertical: 16,
              alignItems: "center",
              borderBottomWidth: isActive ? 2 : 0,
              borderBottomColor: isActive ? "#F4511E" : "transparent",
            }}
          >
            <Button
              onPress={() => jumpTo(route.key)}
              style={{
                backgroundColor: isActive ? "#F4511E" : "#6B7280",
              }}
            >
              <ButtonText>{route.title}</ButtonText>
            </Button>
          </View>
        );
      })}
    </View>
  );
};

export function VitrinePageContent() {
  const vm = useVitrineContext();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "produtos", title: "Produtos em Destaque" },
    { key: "links", title: "Links" },
  ]);
  const layout = useWindowDimensions();

  // Renderize cada cena diretamente em vez de usar SceneMap
  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case "produtos":
        return (
          <View className="flex-1 p-4 pt-6">
            {vm.vitrineProdutos.length < 10 && (
              <View className="mb-6">
                <Text className="text-base text-gray-500 mb-2">
                  Adicione até 10 produtos para exibir em sua vitrine virtual.
                </Text>
                {vm.vitrineProdutos.length === 0 && (
                  <Text className="text-base text-gray-500">
                    Os produtos adicionados aqui aparecerão em destaque para
                    seus clientes.
                  </Text>
                )}
              </View>
            )}

            <VitrineProdutoList
              produtos={vm.vitrineProdutos}
              isLoading={vm.isLoading}
              isReordering={vm.isReorderingProdutos}
              onEdit={vm.handleProductEdit}
              onDelete={vm.handleProductDelete}
              onReorder={vm.handleProductReorder}
            />
          </View>
        );
      case "links":
        return (
          <View className="flex-1 p-4 pt-6">
            <View className="mb-6">
              <Text className="text-base text-gray-500 mb-2">
                Adicione links importantes para seus clientes, como WhatsApp,
                Instagram ou seu site.
              </Text>
            </View>

            <VitrineLinkList
              links={vm.vitrineLinks}
              isLoading={vm.isLoading}
              isReordering={vm.isReorderingLinks}
              onEdit={vm.handleLinkEdit}
              onDelete={vm.handleLinkDelete}
              onReorder={vm.handleLinkReorder}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Vitrine Virtual"
        subtitle="Gerencie produtos em destaque e links importantes"
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={CustomTabBar}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1 }}
      />

      {/* Primary Action Button */}
      <PrimaryActionButton
        onPress={() =>
          index === 0
            ? vm.setIsCreateProductOpen(true)
            : vm.setIsCreateLinkOpen(true)
        }
        label={index === 0 ? "Adicionar Produto" : "Adicionar Link"}
        icon={<Plus size={20} color="white" />}
        position="bottom"
        style={{ bottom: Platform.OS === "ios" ? 20 : 16 }}
      />

      {/* Forms */}
      <VitrineProdutoForm
        open={vm.isCreateProductOpen || vm.isEditProductOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleProductSubmit}
        isLoading={vm.isCreating || vm.isUpdating}
        produto={vm.selectedProduct ?? undefined}
      />

      <VitrineLinkForm
        open={vm.isCreateLinkOpen || vm.isEditLinkOpen}
        onClose={vm.closeModals}
        onSubmit={vm.handleLinkSubmit}
        isLoading={vm.isCreating || vm.isUpdating}
        link={vm.selectedLink ?? undefined}
      />

      {/* AlertDialog de confirmação de exclusão */}
      <ConfirmationDialog
        isOpen={vm.isDeleteOpen}
        onClose={() => vm.setIsDeleteOpen(false)}
        onConfirm={vm.handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja remover este item da vitrine? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
        isLoading={vm.isDeleting}
      />
    </SafeAreaView>
  );
}
