// Path: src/features/addons/view-models/addons.view-model.interface.ts
import { AddonsList } from "../models/addon";

export interface IAddonsViewModel {
  // States
  addonsList: AddonsList[];
  isLoading: boolean;
  searchTerm: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isDeleteDialogOpen: boolean;
  addonsToDelete: string | null;

  // Setters
  setSearchTerm: (term: string) => void;

  // Handlers
  handleDeleteAddonsList: (id: string) => Promise<void>;

  // Filtered data
  filteredAddonsList: AddonsList[];

  // Confirmation dialog
  confirmDeleteAddonsList: (id: string) => void;
  cancelDeleteAddonsList: () => void;
}
