// src/features/leaflets/view-models/leaflets.view-model.ts

import { useState, useCallback, useMemo } from "react";
import { Leaflet } from "../models/leaflet";
import { useLeaflets } from "../hooks/use-leaflets";
import { LeafletFormData } from "../schemas/leaflet.schema";
import { ILeafletsViewModel } from "./leaflets.view-model.interface";
import { useToast } from "@/src/hooks/use-toast";

export function useLeafletsViewModel(): ILeafletsViewModel {
  const [selectedLeaflet, setSelectedLeaflet] = useState<Leaflet | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast();

  const {
    leaflets,
    isLoading,
    createLeaflet,
    updateLeaflet,
    deleteLeaflet,
    isCreating,
    isUpdating,
    isDeleting,
    leafletCount,
  } = useLeaflets();

  // Filtered leaflets
  const filteredLeaflets = useMemo(() => {
    return leaflets.filter((leaflet) =>
      leaflet.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaflets, searchTerm]);

  // Handle view leaflet
  const handleViewLeaflet = useCallback((leaflet: Leaflet) => {
    setSelectedLeaflet(leaflet);
    setIsViewModalVisible(true);
  }, []);

  // Handle edit leaflet
  const handleEditLeaflet = useCallback((leaflet: Leaflet) => {
    setSelectedLeaflet(leaflet);
    setIsFormVisible(true);
  }, []);

  // Handle delete leaflet
  const handleDeleteLeaflet = useCallback((leaflet: Leaflet) => {
    setSelectedLeaflet(leaflet);
    setIsDeleteModalVisible(true);
  }, []);

  // Confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (selectedLeaflet) {
      deleteLeaflet(selectedLeaflet.id);
      setIsDeleteModalVisible(false);

      toast.show({
        title: "Encarte excluído",
        description: "O encarte foi excluído com sucesso.",
        type: "success",
      });

      setSelectedLeaflet(null);
    }
  }, [deleteLeaflet, selectedLeaflet, toast]);

  // Create leaflet
  const handleCreateLeaflet = useCallback(
    async (data: LeafletFormData) => {
      try {
        await createLeaflet({
          nome: data.nome,
          validade: data.validade,
          status: data.status,
          banner: data.banner,
          imagem_01: data.imagem_01,
          imagem_02: data.imagem_02,
          imagem_03: data.imagem_03,
          imagem_04: data.imagem_04,
          imagem_05: data.imagem_05,
          imagem_06: data.imagem_06,
          imagem_07: data.imagem_07,
          imagem_08: data.imagem_08,
        });

        toast.show({
          title: "Encarte criado",
          description: "O novo encarte foi criado com sucesso.",
          type: "success",
        });

        setIsFormVisible(false);
      } catch (error) {
        console.error("Erro ao criar encarte:", error);

        toast.show({
          title: "Erro ao criar",
          description: "Não foi possível criar o encarte. Tente novamente.",
          type: "error",
        });
      }
    },
    [createLeaflet, toast]
  );

  // Update leaflet
  const handleUpdateLeaflet = useCallback(
    async (id: string, data: LeafletFormData) => {
      try {
        await updateLeaflet({
          id,
          data: {
            nome: data.nome,
            validade: data.validade,
            status: data.status,
            banner: data.banner,
            imagem_01: data.imagem_01,
            imagem_02: data.imagem_02,
            imagem_03: data.imagem_03,
            imagem_04: data.imagem_04,
            imagem_05: data.imagem_05,
            imagem_06: data.imagem_06,
            imagem_07: data.imagem_07,
            imagem_08: data.imagem_08,
          },
        });

        toast.show({
          title: "Encarte atualizado",
          description: "O encarte foi atualizado com sucesso.",
          type: "success",
        });

        setIsFormVisible(false);
        setSelectedLeaflet(null);
      } catch (error) {
        console.error("Erro ao atualizar encarte:", error);

        toast.show({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar o encarte. Tente novamente.",
          type: "error",
        });
      }
    },
    [updateLeaflet, toast]
  );

  return {
    leaflets: filteredLeaflets,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    selectedLeaflet,
    leafletCount,
    searchTerm,

    isFormVisible,
    isDeleteModalVisible,
    isViewModalVisible,

    setSearchTerm,
    setSelectedLeaflet,
    setIsFormVisible,
    setIsDeleteModalVisible,
    setIsViewModalVisible,

    handleViewLeaflet,
    handleEditLeaflet,
    handleDeleteLeaflet,
    handleConfirmDelete,
    handleCreateLeaflet,
    handleUpdateLeaflet,
  };
}
