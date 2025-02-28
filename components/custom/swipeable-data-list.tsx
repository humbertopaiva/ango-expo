// Path: components/custom/swipeable-data-list.tsx
import React from "react";
import { View } from "react-native";
import { DataList } from "./data-list";
import { SwipeableListItem } from "./swipeable-list-item";

interface SwipeableDataListProps<T> {
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  error?: string;
  renderSkeleton?: () => React.ReactNode;
  keyExtractor?: (item: T) => string;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string | undefined;
  getImageUri?: (item: T) => string | null | undefined;
  getImageIcon?: () => React.ElementType;
  getStatus?: (item: T) => string | undefined;
  getStatusLabel?: (item: T) => string | undefined;
  getPrice?: (item: T) => string | undefined;
  getPromotionalPrice?: (item: T) => string | undefined;
  getMetadata?: (item: T) => { label: string; value: string }[];
  getBadges?: (item: T) => { label: string; variant?: "solid" | "outline" }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onItemPress?: (item: T) => void;
  className?: string;
}

export function SwipeableDataList<T>({
  data,
  isLoading = false,
  emptyMessage,
  emptyIcon,
  error,
  renderSkeleton,
  keyExtractor = (item: any) => item.id,
  getTitle,
  getSubtitle,
  getImageUri,
  getImageIcon,
  getStatus,
  getStatusLabel,
  getPrice,
  getPromotionalPrice,
  getMetadata = () => [],
  getBadges = () => [],
  onEdit,
  onDelete,
  onItemPress,
  className,
}: SwipeableDataListProps<T>) {
  return (
    <DataList
      data={data}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      emptyIcon={emptyIcon}
      error={error}
      renderSkeleton={renderSkeleton}
      className={className}
      renderItem={(item) => (
        <View className="mb-3">
          <SwipeableListItem
            title={getTitle(item) || ""}
            subtitle={getSubtitle?.(item) || undefined}
            imageUri={getImageUri?.(item) || null}
            imageIcon={getImageIcon?.()}
            status={getStatus?.(item) || undefined}
            statusLabel={getStatusLabel?.(item) || undefined}
            price={getPrice?.(item) || undefined}
            promotionalPrice={getPromotionalPrice?.(item) || undefined}
            metadata={getMetadata(item) || []}
            badges={getBadges(item) || []}
            onEdit={onEdit ? () => onEdit(item) : undefined}
            onDelete={onDelete ? () => onDelete(item) : undefined}
            onPress={onItemPress ? () => onItemPress(item) : undefined}
          />
        </View>
      )}
    />
  );
}
