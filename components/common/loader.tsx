// Path: components/common/loader.tsx
import React from "react";
import { useLoading } from "@/src/providers/loading-provider";
import { FullscreenLoader } from "./fullscreen-loader";

export function Loader() {
  const { isLoading } = useLoading();

  return <FullscreenLoader isVisible={isLoading} />;
}
