// Path: src/features/delivery/components/open-now-companies.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Clock, ArrowRight, MapPin, Store } from "lucide-react-native";
import { DeliveryProfile } from "../models/delivery-profile";
import { checkIfOpen } from "../hooks/use-delivery-page";
import { ImagePreview } from "@/components/custom/image-preview";
import { THEME_COLORS } from "@/src/styles/colors";
import { router } from "expo-router";

interface OpenNowCompaniesProps {
  profiles: DeliveryProfile[];
  isLoading: boolean;
}

export function OpenNowCompanies({
  profiles,
  isLoading,
}: OpenNowCompaniesProps) {
  // Filtra apenas empresas abertas
  const openCompanies = profiles.filter((profile) => checkIfOpen(profile));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Abertos Agora</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[1, 2, 3].map((index) => (
            <View key={`skeleton-${index}`} style={styles.skeletonCard} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Se não houver empresas abertas, não renderize esta seção
  if (openCompanies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text className="text-xl font-semibold text-primary-500 px-4 mb-8">
        Abertos agora
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {openCompanies.map((company) => (
          <TouchableOpacity
            key={company.id}
            style={styles.card}
            onPress={() => {
              if (company.empresa && company.empresa.slug) {
                router.push(`/(drawer)/empresa/${company.empresa.slug}`);
              }
            }}
          >
            <View style={styles.statusIndicator} />
            <View style={styles.companyImageContainer}>
              {company.logo ? (
                <ImagePreview
                  uri={company.logo}
                  width={80}
                  height={80}
                  resizeMode="cover"
                  containerClassName="rounded-xl"
                />
              ) : (
                <View style={styles.fallbackImage}>
                  <Store size={32} color="#9CA3AF" />
                </View>
              )}
            </View>
            <Text style={styles.companyName} numberOfLines={1}>
              {company.nome}
            </Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.infoText}>Aberto agora</Text>
              </View>

              {company.endereco && (
                <View style={styles.infoRow}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {company.endereco}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.categoriesContainer}>
              {company.empresa?.subcategorias?.slice(0, 2).map((subcat) => (
                <View
                  key={subcat.subcategorias_empresas_id.id}
                  style={styles.categoryBadge}
                >
                  <Text style={styles.categoryName}>
                    {subcat.subcategorias_empresas_id.nome}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.visitButton}
              onPress={() => {
                if (company.empresa && company.empresa.slug) {
                  router.push(`/(drawer)/empresa/${company.empresa.slug}`);
                }
              }}
            >
              <Text style={styles.visitButtonText}>Visitar</Text>
              <ArrowRight size={14} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  count: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    position: "relative",
  },
  statusIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981", // verde para aberto
    borderWidth: 2,
    borderColor: "white",
  },
  companyImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  fallbackImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: `${THEME_COLORS.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 10,
    color: THEME_COLORS.primary,
    fontWeight: "500",
  },
  visitButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  visitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
  skeletonCard: {
    width: 220,
    height: 250,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    marginRight: 16,
  },
});
