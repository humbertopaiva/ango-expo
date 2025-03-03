// Path: src/features/dashboard/components/dashboard-company-card-simple.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { User, Tag, Award } from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { ResilientImage } from "@/components/common/resilient-image";

interface SimpleDashboardCompanyCardProps {
  name: string;
  logo?: string;
  categoryName?: string;
  subcategoryName?: string;
  planName?: string;
  primaryColor?: string;
}

export function SimpleDashboardCompanyCard({
  name = "Minha Empresa",
  logo,
  categoryName,
  subcategoryName,
  planName,
  primaryColor = THEME_COLORS.primary,
}: SimpleDashboardCompanyCardProps) {
  return (
    <Card className="overflow-hidden mb-6 shadow-sm">
      {/* Cabeçalho com cor fixa */}
      <View style={[styles.header, { backgroundColor: "#F4511E" }]}>
        <View style={styles.waveOverlay} />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.cardContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {logo ? (
            <ResilientImage
              source={logo}
              style={styles.logo}
              resizeMode="cover"
              fallbackSource={<User size={40} color={primaryColor} />}
            />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: `${primaryColor}20` },
              ]}
            >
              <User size={40} color={primaryColor} />
            </View>
          )}
        </View>

        {/* Informações da empresa */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{name}</Text>

          <View style={styles.categoryContainer}>
            {/* Badge do plano */}
            {planName && (
              <View
                style={[
                  styles.planBadge,
                  { backgroundColor: `${primaryColor}20` },
                ]}
              >
                <Award size={14} color={primaryColor} />
                <Text style={[styles.planText, { color: primaryColor }]}>
                  {planName.charAt(0).toUpperCase() + planName.slice(1)}
                </Text>
              </View>
            )}

            {/* Badge da categoria */}
            {categoryName && (
              <View style={styles.badge}>
                <Tag size={12} color="#4B5563" style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>{categoryName}</Text>
              </View>
            )}

            {/* Badge da subcategoria */}
            {subcategoryName && (
              <View style={styles.badgeSecondary}>
                <Text style={styles.badgeSecondaryText}>{subcategoryName}</Text>
              </View>
            )}
          </View>

          {/* Texto informativo estático em vez de links */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Perfil da Empresa</Text>
            <Text style={styles.infoText}>
              Compartilhe sua página com seus clientes e aumente sua
              visibilidade no marketplace.
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  waveOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 12,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "white",
    position: "absolute",
    top: -40,
    left: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  companyInfo: {
    marginLeft: 100,
    paddingTop: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  badgeSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  badgeSecondaryText: {
    fontSize: 12,
    color: "#6B7280",
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  planText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    marginTop: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
});
