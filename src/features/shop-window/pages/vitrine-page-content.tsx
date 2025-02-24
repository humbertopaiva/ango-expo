// Path: src/features/vitrine/pages/vitrine-page-content.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { TabView, SceneMap } from "react-native-tab-view";

import { Button, ButtonText } from "@/components/ui/button";
import { VitrineProdutoList } from "../components/vitrine-produto-list";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import ScreenHeader from "@/components/ui/screen-header";
import { VitrineProdutoForm } from "../components/vitrine-produto-form";
import { VitrineLinkForm } from "../components/vitrine-link-form";
import { useVitrineContext } from "../contexts/use-vitrine-context";
import { VitrineLinkList } from "../components/vitrine-link-list";

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
            <ButtonText>Adicionar Produto</ButtonText>
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
          <ButtonText>Adicionar Link</ButtonText>
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

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog
        isOpen={vm.isDeleteOpen}
        onClose={() => vm.setIsDeleteOpen(false)}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Confirmar Exclusão
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Tem certeza que deseja remover este item da vitrine? Esta ação não
              pode ser desfeita.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => vm.setIsDeleteOpen(false)}
              disabled={vm.isDeleting}
              size="sm"
              className="mr-2"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={vm.handleConfirmDelete}
              disabled={vm.isDeleting}
              size="sm"
            >
              <ButtonText>
                {vm.isDeleting ? "Excluindo..." : "Excluir"}
              </ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
