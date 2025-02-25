// src/components/custom/profile-section.tsx
import React, { ReactNode } from "react";
import { View } from "react-native";
import { ActionCard } from "./action-card";

interface ProfileSectionProps {
  title: string;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  onAction?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function ProfileSection({
  title,
  actionLabel = "Editar",
  actionIcon,
  onAction,
  children,
  footer,
}: ProfileSectionProps) {
  // Vamos garantir que não estamos envolvendo o conteúdo com ScrollView
  return (
    <ActionCard
      title={title}
      actionLabel={actionLabel}
      actionIcon={actionIcon}
      onAction={onAction}
      footer={footer}
    >
      {children}
    </ActionCard>
  );
}
