// Path: src/features/leaflets-page/hooks/use-leaflets.ts
import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { Leaflet } from "@/src/features/commerce/models/leaflet";

export function useLeaflets() {
  const [leaflets, setLeaflets] = useState<Leaflet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaflets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/encartes");
      setLeaflets(response.data.data || []);
    } catch (err) {
      console.error("Erro ao carregar encartes:", err);
      setError(
        err instanceof Error ? err : new Error("Erro ao carregar encartes")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaflets();
  }, []);

  const refreshLeaflets = async () => {
    await fetchLeaflets();
  };

  return {
    leaflets,
    isLoading,
    error,
    refreshLeaflets,
  };
}
