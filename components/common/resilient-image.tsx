// src/components/common/resilient-image.tsx

import { imageUtils } from "@/src/utils/image.utils";
import React, { useState, useEffect } from "react";
import { Image, ImageProps, ActivityIndicator, View } from "react-native";

interface ResilientImageProps extends Omit<ImageProps, "source"> {
  source: string;
  fallbackSource?: any;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  source,
  fallbackSource,
  style,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [validatedSource, setValidatedSource] = useState<string | null>(null);

  useEffect(() => {
    validateAndSetSource();
  }, [source]);

  const validateAndSetSource = async () => {
    try {
      setIsLoading(true);
      setError(false);

      if (typeof source !== "string") {
        setError(true);
        return;
      }

      const isValid = await imageUtils.validateImageUrl(source);
      if (isValid) {
        setValidatedSource(source);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error || !validatedSource) {
    return fallbackSource ? (
      <Image source={fallbackSource} style={style} {...props} />
    ) : null;
  }

  return (
    <Image
      source={{ uri: validatedSource }}
      style={style}
      {...props}
      onError={() => setError(true)}
    />
  );
};
