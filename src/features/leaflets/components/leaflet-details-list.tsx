// Path: src/features/leaflets/components/leaflet-details-list.tsx

import React from "react";
import { Leaflet } from "../models/leaflet";
import { SwipeableDataList } from "@/components/custom/swipeable-data-list";
import { FileText } from "lucide-react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeafletSkeletonList } from "./leaflet-skeleton";

interface LeafletDetailsListProps {
  leaflets: Leaflet[];
  isLoading: boolean;
  onEdit: (leaflet: Leaflet) => void;
  onDelete: (leaflet: Leaflet) => void;
  onView?: (leaflet: Leaflet) => void;
}

export function LeafletDetailsList({
  leaflets = [],
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}: LeafletDetailsListProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Conta o número de páginas de um encarte
  const countPages = (leaflet: Leaflet) => {
    return [
      leaflet.imagem_01,
      leaflet.imagem_02,
      leaflet.imagem_03,
      leaflet.imagem_04,
      leaflet.imagem_05,
      leaflet.imagem_06,
      leaflet.imagem_07,
      leaflet.imagem_08,
    ].filter(Boolean).length;
  };

  // Verifica se o encarte tem PDF
  const hasPdf = (leaflet: Leaflet) => {
    return !!leaflet.pdf;
  };

  // Define o ícone baseado no tipo de encarte (PDF ou imagens)
  const getLeafletIcon = (leaflet: Leaflet) => {
    return FileText;
  };

  return (
    <SwipeableDataList
      data={leaflets}
      isLoading={isLoading}
      emptyMessage="Nenhum encarte encontrado. Crie um novo encarte para começar."
      emptyIcon={<FileText size={32} color="#6B7280" />}
      renderSkeleton={() => <LeafletSkeletonList count={3} />}
      keyExtractor={(leaflet) => leaflet.id}
      getTitle={(leaflet) => leaflet.nome}
      getSubtitle={(leaflet) => `Válido até: ${formatDate(leaflet.validade)}`}
      getImageUri={(leaflet) => leaflet.banner}
      getStatus={(leaflet) => leaflet.status}
      getStatusLabel={(leaflet) =>
        leaflet.status === "ativo" ? "Ativo" : "Inativo"
      }
      onEdit={onEdit}
      onDelete={onDelete}
      onItemPress={onView}
    />
  );
}
