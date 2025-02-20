import { ReactNode } from "react";
import { ProfileContext } from "./profile.context-value";
import { useProfileViewModel } from "../view-models/profile.view-model";

interface ProfileProviderProps {
  children: ReactNode;
  companyId: string;
}

export function ProfileProvider({ children, companyId }: ProfileProviderProps) {
  const viewModel = useProfileViewModel(companyId);

  return (
    <ProfileContext.Provider value={viewModel}>
      {children}
    </ProfileContext.Provider>
  );
}
