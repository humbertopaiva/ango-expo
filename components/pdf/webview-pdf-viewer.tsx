// Path: src/features/commerce/components/webview-pdf-viewer.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Animated, Image } from "react-native";
import { WebView } from "react-native-webview";
import { THEME_COLORS } from "@/src/styles/colors";

interface WebViewPdfViewerProps {
  pdfUrl: string;
  onError?: (error: any) => void;
}

export const WebViewPdfViewer = ({
  pdfUrl,
  onError,
}: WebViewPdfViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeTextAnim = useRef(new Animated.Value(0.7)).current;

  // Animações para os círculos pulsantes
  const circle1Anim = useRef(new Animated.Value(0.6)).current;
  const circle2Anim = useRef(new Animated.Value(0.6)).current;
  const circle3Anim = useRef(new Animated.Value(0.6)).current;

  // Google PDF Viewer é uma maneira simples e confiável de visualizar PDFs via WebView
  const googlePdfViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(
    pdfUrl
  )}&embedded=true`;

  useEffect(() => {
    // Animação para o texto de carregamento
    const textFadeAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeTextAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeTextAnim, {
          toValue: 0.7,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Animação para os círculos pulsantes - mais suave
    const pulseCircle1 = Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Anim, {
          toValue: 0.85,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(circle1Anim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseCircle2 = Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Anim, {
          toValue: 0.9,
          duration: 2500,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(circle2Anim, {
          toValue: 0.65,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseCircle3 = Animated.loop(
      Animated.sequence([
        Animated.timing(circle3Anim, {
          toValue: 0.95,
          duration: 3000,
          delay: 800,
          useNativeDriver: true,
        }),
        Animated.timing(circle3Anim, {
          toValue: 0.7,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    textFadeAnim.start();
    pulseCircle1.start();
    pulseCircle2.start();
    pulseCircle3.start();

    // Aumentado para 7 segundos para dar tempo de carregar o PDF
    const preloadTimer = setTimeout(() => {
      // Mantemos a tela de carregamento por no mínimo 7 segundos
    }, 5000);

    return () => {
      clearTimeout(preloadTimer);
      textFadeAnim.stop();
      pulseCircle1.stop();
      pulseCircle2.stop();
      pulseCircle3.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: googlePdfViewer }}
        style={styles.webview}
        onError={onError}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => {
          // Garantimos que a tela de carregamento ficará visível por pelo menos 7 segundos
          setTimeout(() => {
            setIsLoading(false);
          }, 7000);
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={[styles.loadingContainer, { backgroundColor: "#F4511E" }]}
          >
            {/* Logo com círculos pulsantes */}
            <View style={styles.logoContainer}>
              <Animated.View
                style={[
                  styles.pulsingCircle,
                  styles.circle3,
                  { transform: [{ scale: circle3Anim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulsingCircle,
                  styles.circle2,
                  { transform: [{ scale: circle2Anim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulsingCircle,
                  styles.circle1,
                  { transform: [{ scale: circle1Anim }] },
                ]}
              />
              <Image
                source={require("assets/images/logo-white.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              {/* Texto abaixo da logo */}
              <Animated.Text
                style={[styles.loadingText, { opacity: fadeTextAnim }]}
              >
                Carregando ofertas
              </Animated.Text>
            </View>
          </View>
        )}
      />
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: "#F4511E" }]}>
          {/* Logo com círculos pulsantes */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.pulsingCircle,
                styles.circle3,
                { transform: [{ scale: circle3Anim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.pulsingCircle,
                styles.circle2,
                { transform: [{ scale: circle2Anim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.pulsingCircle,
                styles.circle1,
                { transform: [{ scale: circle1Anim }] },
              ]}
            />
            <Image
              source={require("assets/images/logo-white.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Texto abaixo da logo */}
            <Animated.Text
              style={[styles.loadingText, { opacity: fadeTextAnim }]}
            >
              Carregando ofertas...
            </Animated.Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  logoContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 220, // Aumentado para acomodar o texto abaixo da logo
  },
  logo: {
    width: 120,
    height: 120,
    zIndex: 10,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 6,
    zIndex: 10,
  },
  pulsingCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)", // Mais transparente para ficar mais suave
  },
  circle1: {
    width: 140,
    height: 140,
  },
  circle2: {
    width: 180,
    height: 180,
  },
  circle3: {
    width: 220,
    height: 220,
  },
});
