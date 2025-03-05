// src/features/leaflets/components/company-tabs.tsx
import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { LayoutGrid } from "lucide-react-native";
import { Company } from "../models/leaflet";
import { ResilientImage } from "@/components/common/resilient-image";

interface CompanyTabsProps {
  companies: Company[];
  selectedCompany: string | null;
  onSelectCompany: (slug: string | null) => void;
  isLoading: boolean;
}

export function CompanyTabs({
  companies,
  selectedCompany,
  onSelectCompany,
  isLoading,
}: CompanyTabsProps) {
  if (isLoading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-4"
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="h-10 w-32 rounded-full bg-gray-200 mx-1 animate-pulse"
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pb-4"
    >
      <TouchableOpacity
        onPress={() => onSelectCompany(null)}
        className={`flex-row items-center h-12 px-4 mx-1 rounded-full ${
          selectedCompany === null
            ? "bg-primary-500"
            : "bg-gray-100 border border-gray-200"
        }`}
      >
        <LayoutGrid
          size={18}
          color={selectedCompany === null ? "white" : "#6B7280"}
        />
        <Text
          className={`ml-2 font-medium ${
            selectedCompany === null ? "text-white" : "text-gray-700"
          }`}
        >
          Todas
        </Text>
      </TouchableOpacity>

      {companies.map((company) => (
        <TouchableOpacity
          key={company.slug}
          onPress={() => onSelectCompany(company.slug)}
          className={`flex-row items-center h-12 px-4 mx-1 rounded-full ${
            selectedCompany === company.slug
              ? "bg-primary-500"
              : "bg-gray-100 border border-gray-200"
          }`}
        >
          <View className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
            <ResilientImage
              source={company.logo}
              style={{ width: 24, height: 24 }}
              fallbackSource={<LayoutGrid size={14} color="#6B7280" />}
            />
          </View>
          <Text
            className={`ml-2 font-medium ${
              selectedCompany === company.slug ? "text-white" : "text-gray-700"
            }`}
          >
            {company.nome}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
