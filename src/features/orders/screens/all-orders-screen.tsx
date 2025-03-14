// Path: src/features/orders/screens/all-orders-screen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { ChevronRight, Package, Store } from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, OrderStatus } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { CompanyFilterDropdown } from "../components/company-filter-dropdown";

export function AllOrdersScreen() {
  // Estados iniciais vazios
  const [displayData, setDisplayData] = useState<{
    groupedOrders: Record<string, Order[]>;
    companies: Array<{ id: string; slug: string; name: string }>;
  }>({
    groupedOrders: {},
    companies: [],
  });
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const initialRenderDone = useRef(false);

  // ViewModel para obter os dados
  const { orders } = useOrderViewModel();
  const primaryColor = THEME_COLORS.primary;

  // Processar dados uma única vez na montagem inicial
  useEffect(() => {
    if (!initialRenderDone.current) {
      processOrderData(orders, selectedCompany);
      initialRenderDone.current = true;
    }
  }, []);

  // Função para processar os dados dos pedidos
  const processOrderData = useCallback(
    (ordersList: Order[], companyFilter: typeof selectedCompany) => {
      // Criar grupos de pedidos por empresa
      const grouped: Record<string, Order[]> = {};
      const companyList: Array<{ id: string; slug: string; name: string }> = [];
      const companyMap: Record<string, boolean> = {};

      // Agrupar pedidos por empresa
      ordersList.forEach((order) => {
        const slug = order.companySlug;

        if (!grouped[slug]) {
          grouped[slug] = [];

          // Adicionar empresa à lista apenas se ainda não estiver lá
          if (!companyMap[slug]) {
            companyList.push({
              id: order.companyId,
              slug,
              name: order.companyName,
            });
            companyMap[slug] = true;
          }
        }

        grouped[slug].push({ ...order });
      });

      // Ordenar pedidos em cada grupo
      Object.keys(grouped).forEach((slug) => {
        grouped[slug].sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      });

      // Filtrar para empresa selecionada, se houver
      const filteredGrouped = companyFilter
        ? { [companyFilter.slug]: grouped[companyFilter.slug] || [] }
        : grouped;

      // Atualizar estado em uma única chamada
      setDisplayData({
        groupedOrders: filteredGrouped,
        companies: companyList,
      });
    },
    []
  );

  // Manipuladores de eventos
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    processOrderData(orders, selectedCompany);
    setRefreshing(false);
  }, [orders, selectedCompany, processOrderData]);

  const handleSelectCompany = useCallback(
    (company: typeof selectedCompany) => {
      setSelectedCompany(company);
      // Reprocessar dados com o novo filtro
      processOrderData(orders, company);
    },
    [orders, processOrderData]
  );

  // Formatadores
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Renderizador de seção de empresa
  const renderCompanySection = ({ item }: { item: [string, Order[]] }) => {
    const [companySlug, companyOrders] = item;

    if (!companyOrders || companyOrders.length === 0) {
      return null;
    }

    const company = companyOrders[0]?.companyName || "";

    return (
      <Card className="mb-4 border border-gray-100 overflow-hidden">
        <TouchableOpacity
          onPress={() => router.push(`/(drawer)/empresa/${companySlug}/orders`)}
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
                  router.push(
                    `/(drawer)/empresa/${companySlug}/orders/${order.id}`
                  )
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

          {companyOrders.length > 3 && (
            <TouchableOpacity
              onPress={() =>
                router.push(`/(drawer)/empresa/${companySlug}/orders`)
              }
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

  // Componente de lista vazia
  const EmptyComponent = () => (
    <Card className="p-6 items-center justify-center border border-gray-100">
      <Package size={48} color="#9CA3AF" className="mb-3" />
      <Text className="text-gray-800 font-semibold text-lg mb-2 text-center">
        Nenhum pedido encontrado
      </Text>
      <Text className="text-gray-500 text-center">
        Você ainda não fez nenhum pedido.
      </Text>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Todos os Pedidos"
        subtitle="Histórico completo"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <CompanyFilterDropdown
        companies={displayData.companies}
        selectedCompany={selectedCompany}
        onSelectCompany={handleSelectCompany}
      />

      <FlatList
        data={Object.entries(displayData.groupedOrders)}
        keyExtractor={([companySlug]) => companySlug}
        renderItem={renderCompanySection}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
}
