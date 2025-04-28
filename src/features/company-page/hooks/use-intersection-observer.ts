// Path: src/hooks/use-intersection-observer.ts
import { useEffect, useRef, useState } from "react";
import { View, findNodeHandle, NativeModules } from "react-native";

export interface IntersectionObserverOptions {
  threshold?: number; // Valor entre 0 e 1
  root?: View | null; // Elemento que age como viewport
  rootMargin?: string; // Margens do viewport (não implementado completamente em React Native)
}

export interface IntersectionObserverEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  target: number | null;
}

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const elementRef = useRef<View>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const intersectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Threshold padrão de 0.5 (50% visível)
  const threshold = options.threshold || 0.5;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkIntersection = () => {
      const node = findNodeHandle(element);
      if (!node) return;

      element.measure((x, y, width, height, pageX, pageY) => {
        // Medir a posição na tela
        if (width === 0 || height === 0) return;

        // Obter as dimensões da janela
        const { width: windowWidth, height: windowHeight } =
          NativeModules.ScreenDimensions
            ? NativeModules.ScreenDimensions.getWindowDimensions()
            : { width: 0, height: 0 };

        // Verificar se o elemento está visível na tela
        const isElementVisible =
          pageY < windowHeight &&
          pageY + height > 0 &&
          pageX < windowWidth &&
          pageX + width > 0;

        // Calcular a porcentagem visível (estimativa simples)
        const visibleHeight =
          Math.min(pageY + height, windowHeight) - Math.max(pageY, 0);
        const visibleWidth =
          Math.min(pageX + width, windowWidth) - Math.max(pageX, 0);
        const visibleArea =
          Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
        const totalArea = width * height;

        const intersectionRatio = totalArea > 0 ? visibleArea / totalArea : 0;

        // Elemento é considerado "intersecting" se a razão de interseção é maior que o threshold
        const isIntersecting = intersectionRatio >= threshold;

        if (isVisible !== isIntersecting) {
          setIsVisible(isIntersecting);
        }

        setEntry({
          isIntersecting,
          intersectionRatio,
          target: node,
        });
      });
    };

    // Verificar a interseção periodicamente (aproximadamente 60fps)
    intersectionCheckIntervalRef.current = setInterval(checkIntersection, 200);

    // Limpar o intervalo ao desmontar
    return () => {
      if (intersectionCheckIntervalRef.current) {
        clearInterval(intersectionCheckIntervalRef.current);
      }
    };
  }, [options, threshold, isVisible]);

  return { ref: elementRef, entry, isVisible };
}
