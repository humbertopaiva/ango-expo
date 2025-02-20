import { Profile, UpdateProfileDTO } from "../models/profile";

export interface IProfileViewModel {
  // Estados
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  activeTab:
    | "basic"
    | "contact"
    | "social"
    | "hours"
    | "visual"
    | "payment"
    | "additional";

  // Estados de modais
  isBasicInfoOpen: boolean;
  isContactInfoOpen: boolean;
  isSocialLinksOpen: boolean;
  isHoursOpen: boolean;
  isVisualOpen: boolean;
  isPaymentOpen: boolean;
  isAdditionalOpen: boolean;

  // Setters
  setActiveTab: (tab: IProfileViewModel["activeTab"]) => void;
  setIsBasicInfoOpen: (isOpen: boolean) => void;
  setIsContactInfoOpen: (isOpen: boolean) => void;
  setIsSocialLinksOpen: (isOpen: boolean) => void;
  setIsHoursOpen: (isOpen: boolean) => void;
  setIsVisualOpen: (isOpen: boolean) => void;
  setIsPaymentOpen: (isOpen: boolean) => void;
  setIsAdditionalOpen: (isOpen: boolean) => void;

  // Handlers
  handleUpdateBasicInfo: (data: UpdateProfileDTO) => void;
  handleUpdateContactInfo: (data: UpdateProfileDTO) => void;
  handleUpdateSocialLinks: (data: UpdateProfileDTO) => void;
  handleUpdateHours: (data: UpdateProfileDTO) => void;
  handleUpdateVisual: (data: UpdateProfileDTO) => void;
  handleUpdatePayment: (data: UpdateProfileDTO) => void;
  handleUpdateAdditional: (data: UpdateProfileDTO) => void;
  closeModals: () => void;
}
