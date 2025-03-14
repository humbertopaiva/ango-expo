// Path: src/features/orders/screens/all-orders-screen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, HStack, VStack, Divider } from "@gluestack-ui/themed";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Package,
  Store,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, OrderStatus } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyFilterDropdown } from "../components/company-filter-dropdown";

export function AllOrdersScreen() {
  const { orders } = useOrderViewModel();
  const [groupedOrders, setGroupedOrders] = useState<Record<string, Order[]>>(
    {}
  );
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = THEME_COLORS.primary;

  // Adicionar estado para a empresa selecionada
  const [companies, setCompanies] = useState<
    { id: string; slug: string; name: string }[]
  >([]);
  const [selectedCompany, setSelectedCompany] = useState<
    (typeof companies)[0] | null
  >(null);

  // Agrupar pedidos por empresa
  useEffect(() => {
    const grouped = orders.reduce((acc, order) => {
      if (!acc[order.companySlug]) {
        acc[order.companySlug] = [];
      }
      acc[order.companySlug].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

    // Ordenar pedidos de cada empresa por data (mais recentes primeiro)
    Object.keys(grouped).forEach((companySlug) => {
      grouped[companySlug].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    });

    // Se uma empresa estiver selecionada, filtrar apenas seus pedidos
    const filteredGrouped = selectedCompany
      ? { [selectedCompany.slug]: grouped[selectedCompany.slug] || [] }
      : grouped;

    setGroupedOrders(filteredGrouped);

    // Extrair lista de empresas para o filtro
    const companyList = Object.entries(grouped).map(
      ([slug, companyOrders]) => ({
        id: companyOrders[0].companyId,
        slug,
        name: companyOrders[0].companyName,
      })
    );

    setCompanies(companyList);
  }, [orders, selectedCompany]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Recarregar pedidos se necessário
    setRefreshing(false);
  };

  const navigateToCompanyOrders = (companySlug: string) => {
    router.push(`/empresa/${companySlug}/orders`);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Renderizar grupos de pedidos por empresa
  const renderCompanySection = ({ item }: { item: [string, Order[]] }) => {
    const [companySlug, companyOrders] = item;
    const company = companyOrders[0].companyName;

    return (
      <Card className="mb-4 border border-gray-100 overflow-hidden">
        <TouchableOpacity
          onPress={() => navigateToCompanyOrders(companySlug)}
          className="p-4 border-b border-gray-100"
        >
          <HStack className="justify-between items-center">
            <HStack space="sm">
              <Store size={20} color={primaryColor} />
              <Text className="font-semibold text-gray-800">{company}</Text>
            </HStack>

            <HStack space="sm" alignItems="center">
              <Text className="text-sm text-gray-500">
                {companyOrders.length}{" "}
                {companyOrders.length === 1 ? "pedido" : "pedidos"}
              </Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </HStack>
          </HStack>
        </TouchableOpacity>

        <View>
          {companyOrders.slice(0, 3).map((order, index) => {
            const isDelivered = order.status === OrderStatus.DELIVERED;
            const isCanceled = order.status === OrderStatus.CANCELED;
            const statusColor = isDelivered
              ? "#059669"
              : isCanceled
              ? "#DC2626"
              : "#3B82F6";

            return (
              <TouchableOpacity
                key={order.id}
                onPress={() =>
                  router.push(`/empresa/${companySlug}/orders/${order.id}`)
                }
                className={`p-4 ${
                  index < companyOrders.slice(0, 3).length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <HStack className="justify-between items-center">
                  <VStack>
                    <Text className="text-gray-700">
                      Pedido #{order.id.replace("order_", "").substring(0, 6)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </Text>
                  </VStack>

                  <HStack space="sm" alignItems="center">
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: isDelivered
                          ? "#D1FAE5"
                          : isCanceled
                          ? "#FEE2E2"
                          : "#DBEAFE",
                      }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: statusColor }}
                      >
                        {isDelivered
                          ? "Entregue"
                          : isCanceled
                          ? "Cancelado"
                          : "Em andamento"}
                      </Text>
                    </View>

                    <Text className="font-bold text-gray-800">
                      {formatCurrency(order.total)}
                    </Text>
                  </HStack>
                </HStack>
              </TouchableOpacity>
            );
          })}

          {/* Ver mais link se houver mais de 3 pedidos */}
          {companyOrders.length > 3 && (
            <TouchableOpacity
              onPress={() => navigateToCompanyOrders(companySlug)}
              className="p-4 bg-gray-50"
            >
              <Text
                className="text-center font-medium"
                style={{ color: primaryColor }}
              >
                Ver mais {companyOrders.length - 3}{" "}
                {companyOrders.length - 3 === 1 ? "pedido" : "pedidos"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Todos os Pedidos"
        subtitle="Histórico completo"
        showBackButton={true}
        onBackPress={() => router.back()}
      />
      <CompanyFilterDropdown
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
      />
      <FlatList
        data={Object.entries(groupedOrders)}
        keyExtractor={([companySlug]) => companySlug}
        renderItem={renderCompanySection}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Card className="p-6 items-center justify-center border border-gray-100">
            <Package size={48} color="#9CA3AF" className="mb-3" />
            <Text className="text-gray-800 font-semibold text-lg mb-2 text-center">
              Nenhum pedido encontrado
            </Text>
            <Text className="text-gray-500 text-center">
              Você ainda não fez nenhum pedido.
            </Text>
          </Card>
        }
      />
    </View>
  );
}
