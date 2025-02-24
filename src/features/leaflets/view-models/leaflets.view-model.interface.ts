// src/features/leaflets/view-models/leaflets.view-model.interface.ts

import { Leaflet } from "../models/leaflet";
import { LeafletFormData } from "../schemas/leaflet.schema";

export interface ILeafletsViewModel {
  // States
  leaflets: Leaflet[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  selectedLeaflet: Leaflet | null;
  leafletCount: number;
  searchTerm: string;

  // Modal states
  isFormVisible: boolean;
  isDeleteModalVisible: boolean;
  isViewModalVisible: boolean;

  // Setters
  setSearchTerm: (term: string) => void;
  setSelectedLeaflet: (leaflet: Leaflet | null) => void;
  setIsFormVisible: (visible: boolean) => void;
  setIsDeleteModalVisible: (visible: boolean) => void;
  setIsViewModalVisible: (visible: boolean) => void;

  // Handlers
  handleViewLeaflet: (leaflet: Leaflet) => void;
  handleEditLeaflet: (leaflet: Leaflet) => void;
  handleDeleteLeaflet: (leaflet: Leaflet) => void;
  handleConfirmDelete: () => void;
  handleCreateLeaflet: (data: LeafletFormData) => Promise<void>;
  handleUpdateLeaflet: (id: string, data: LeafletFormData) => Promise<void>;
}
