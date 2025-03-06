// Path: src/components/common/safe-map.tsx
import React from "react";

interface SafeMapProps<T> {
  data: T[] | null | undefined;
  renderItem: (item: T, index: number) => React.ReactNode;
  fallback?: React.ReactNode;
}

export function SafeMap<T>({
  data,
  renderItem,
  fallback = null,
}: SafeMapProps<T>) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <>{fallback}</>;
  }

  return <>{data.map((item, index) => renderItem(item, index))}</>;
}
