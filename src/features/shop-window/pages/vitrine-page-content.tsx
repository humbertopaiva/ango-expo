// Path: src/features/vitrine/pages/vitrine-page-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useVitrineContext } from "../contexts/use-vitrine-context";
import { Button } from "@gluestack-ui/themed";
import { VitrineProdutoList } from "../components/vitrine-produto-list";
import { VitrineLinkList } from "../components/vitrine-link-list";
import { VitrineProdutoForm } from "../components/vitrine-produto-form";
import { VitrineLinkForm } from "../components/vitrine-link-form";
import { Dialog } from "@/components/ui/dialog";
import ScreenHeader from "@/components/ui/screen-header";

export function VitrinePageContent() {
  const vm = useVitrineContext();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "produtos", title: "Produtos em Destaque" },
    { key: "links", title: "Links" },
  ]);

  const renderScene = SceneMap({
    produtos: () => (
      <View className="space-y-4 p-4">
        {vm.vitrineProdutos.length < 10 && (
          <Button
            onPress={() => vm.setIsCreateProductOpen(true)}
            className="gap-2"
          >
            <Plus size={16} color="white" />
            <Button.Text>Adicionar Produto</Button.Text>
          </Button>
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
    ),
    links: () => (
      <View className="space-y-4 p-4">
        <Button onPress={() => vm.setIsCreateLinkOpen(true)} className="gap-2">
          <Plus size={16} color="white" />
          <Button.Text>Adicionar Link</Button.Text>
        </Button>

        <VitrineLinkList
          links={vm.vitrineLinks}
          isLoading={vm.isLoading}
          isReordering={vm.isReorderingLinks}
          onEdit={vm.handleLinkEdit}
          onDelete={vm.handleLinkDelete}
          onReorder={vm.handleLinkReorder}
        />
      </View>
    ),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenHeader
        title="Vitrine"
        subtitle="Gerencie os produtos em destaque e links da sua loja"
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{ flex: 1 }}
      />

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

      <Dialog
        visible={vm.isDeleteOpen}
        onDismiss={() => vm.setIsDeleteOpen(false)}
        onClose={() => vm.setIsDeleteOpen(false)}
      >
        <Dialog.Content>
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja remover este item da vitrine? Esta ação não
            pode ser desfeita.
          </Dialog.Description>
          <View className="flex-row justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              onPress={() => vm.setIsDeleteOpen(false)}
              disabled={vm.isDeleting}
            >
              <Button.Text>Cancelar</Button.Text>
            </Button>
            <Button
              variant="destructive"
              onPress={vm.handleConfirmDelete}
              disabled={vm.isDeleting}
            >
              <Button.Text>
                {vm.isDeleting ? "Excluindo..." : "Excluir"}
              </Button.Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog>
    </SafeAreaView>
  );
}
