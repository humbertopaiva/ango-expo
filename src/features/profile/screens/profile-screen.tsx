import React from "react";
import useAuthStore from "@/src/stores/auth";
import { ProfileProvider } from "../contexts/profile-provider";
import { ProfileContent } from "./profile-content";

export function ProfileScreen() {
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  if (!companyId) {
    return null;
  }

  return (
    <ProfileProvider companyId={companyId}>
      <ProfileContent />
    </ProfileProvider>
  );
}
