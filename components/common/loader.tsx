// Path: components/common/loader.tsx
import React, { memo, useEffect, useState } from "react";
import { useLoading } from "@/src/providers/loading-provider";
import { SimpleFullscreenLoader } from "./simple-fullscreen-loader";

// Usando React.memo para evitar re-renderizações desnecessárias
export const Loader = memo(function Loader() {
  const { isLoading } = useLoading();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Se estiver carregando, mostra imediatamente
    if (isLoading) {
      setShouldRender(true);
    }
    // Se não estiver carregando, espera um pouco antes de esconder
    else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Só renderiza o loader se deveria mostrar ou está em processo de ocultar
  if (!shouldRender && !isLoading) return null;

  return <SimpleFullscreenLoader isVisible={isLoading} />;
});
