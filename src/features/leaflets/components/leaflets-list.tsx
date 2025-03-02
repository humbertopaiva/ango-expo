// src/features/leaflets/components/leaflets-list.tsx

import React from "react";
import { Leaflet } from "../models/leaflet";
import { DataList } from "@/components/custom/data-list";
import { ListItem } from "@/components/custom/list-item";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeafletsListProps {
  leaflets: Leaflet[];
  isLoading: boolean;
  onEdit: (leaflet: Leaflet) => void;
  onDelete: (leaflet: Leaflet) => void;
  onView?: (leaflet: Leaflet) => void;
}

export function LeafletsList({
  leaflets = [],
  isLoading = false,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
}: LeafletsListProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Count the number of pages in a leaflet
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

  return (
    <DataList
      data={leaflets}
      isLoading={isLoading}
      emptyMessage="Nenhum encarte encontrado. Crie um novo encarte para começar."
      renderItem={(leaflet) => (
        <ListItem
          title={leaflet.nome}
          subtitle={`Válido até: ${formatDate(leaflet.validade)}`}
          imageUri={leaflet.banner}
          status={leaflet.status}
          statusLabel={leaflet.status === "ativo" ? "Ativo" : "Inativo"}
          onEdit={() => onEdit(leaflet)}
          onDelete={() => onDelete(leaflet)}
          onPress={() => onView(leaflet)}
          badges={[
            {
              label: `${countPages(leaflet)} ${
                countPages(leaflet) === 1 ? "página" : "páginas"
              }`,
              variant: "outline",
            },
          ]}
        />
      )}
    />
  );
}
