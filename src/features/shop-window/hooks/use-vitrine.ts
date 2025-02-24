// Path: src/features/vitrine/hooks/use-vitrine.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vitrineService } from "../services/vitrine.service";
import useAuthStore from "@/src/stores/auth";
import {
  CreateVitrineProdutoDTO,
  CreateVitrineLinkDTO,
  UpdateVitrineProdutoDTO,
  UpdateVitrineLinkDTO,
  VitrineLink,
  VitrineProduto,
} from "../models";

export function useVitrine() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const productQueryKey = ["vitrine-products", companyId];
  const linksQueryKey = ["vitrine-links", companyId];

  // Produtos Vitrine
  const { data: produtosData, isLoading: isLoadingProdutos } = useQuery({
    queryKey: productQueryKey,
    queryFn: () => vitrineService.getVitrineProdutos(companyId as string),
    enabled: !!companyId,
  });

  const createProdutoMutation = useMutation({
    mutationFn: (data: Omit<CreateVitrineProdutoDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");
      return vitrineService.createVitrineProduto({
        ...data,
        empresa: companyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKey });
    },
  });

  const updateProdutoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVitrineProdutoDTO }) =>
      vitrineService.updateVitrineProduto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKey });
    },
  });

  const deleteProdutoMutation = useMutation({
    mutationFn: vitrineService.deleteVitrineProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKey });
    },
  });

  // Links Vitrine
  const { data: linksData, isLoading: isLoadingLinks } = useQuery({
    queryKey: linksQueryKey,
    queryFn: () => vitrineService.getVitrineLinks(companyId as string),
    enabled: !!companyId,
  });

  const createLinkMutation = useMutation({
    mutationFn: (data: Omit<CreateVitrineLinkDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");
      return vitrineService.createVitrineLink({
        ...data,
        empresa: companyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVitrineLinkDTO }) =>
      vitrineService.updateVitrineLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: vitrineService.deleteVitrineLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  const reorderProdutosMutation = useMutation({
    mutationFn: (produtos: VitrineProduto[]) => {
      return Promise.all(
        produtos.map((produto) =>
          vitrineService.updateVitrineProduto(produto.id, {
            ordem: produto.ordem,
            sort: produto.sort ?? undefined,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKey });
    },
  });

  const reorderLinksMutation = useMutation({
    mutationFn: (links: VitrineLink[]) => {
      return Promise.all(
        links.map((link) =>
          vitrineService.updateVitrineLink(link.id, {
            ordem: link.ordem,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  const vitrineProdutos = produtosData?.data || [];
  const vitrineLinks = linksData?.data || [];

  return {
    vitrineProdutos,
    isLoadingProdutos,
    createVitrineProduto: createProdutoMutation.mutate,
    updateVitrineProduto: updateProdutoMutation.mutate,
    deleteVitrineProduto: deleteProdutoMutation.mutate,
    reorderVitrineProdutos: reorderProdutosMutation.mutate,
    isCreatingProduto: createProdutoMutation.isPending,
    isUpdatingProduto: updateProdutoMutation.isPending,
    isDeletingProduto: deleteProdutoMutation.isPending,

    vitrineLinks,
    isLoadingLinks,
    createVitrineLink: createLinkMutation.mutate,
    updateVitrineLink: updateLinkMutation.mutate,
    deleteVitrineLink: deleteLinkMutation.mutate,
    reorderVitrineLinks: reorderLinksMutation.mutate,
    isCreatingLink: createLinkMutation.isPending,
    isUpdatingLink: updateLinkMutation.isPending,
    isDeletingLink: deleteLinkMutation.isPending,

    isReorderingProdutos: reorderProdutosMutation.isPending,
    isReorderingLinks: reorderLinksMutation.isPending,
  };
}
