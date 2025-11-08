import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Order, OrderStatus } from "@/types/orders.types";
import { useOrders } from "@/hooks/useOrders"; // 1. Importar o hook

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

const statusFilters: OrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "ready",
];

export default function OrdersScreen() {
  // 2. Usar o hook para obter os dados
  const { orders, isLoading, error, refetch } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "Todos">("Todos");

  const filteredOrders = useMemo(() => {
    if (filter === "Todos") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const renderOrder = ({ item }: { item: Order }) => (
    <Link href={{ pathname: "/orders/[id]", params: { id: item.id } }} asChild>
      <TouchableOpacity style={styles.orderCard}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderCustomer}>{item.customerName}</Text>
            <Text
              style={styles.orderPrice}
            >{`R$ ${item.totalPrice.toFixed(2)}`}</Text>
          </View>
          <Text
            style={styles.orderProduct}
          >{`${item.quantity}x ${item.productName}`}</Text>
          <View style={styles.deliveryInfo}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text style={styles.deliveryText}>
              {new Date(item.deliveryDate).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}{" "}
              às {item.deliveryTime}
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  // 3. Adicionar telas de loading e erro
  if (isLoading && !orders.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "Todos" && styles.filterActive,
            ]}
            onPress={() => setFilter("Todos")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "Todos" && styles.filterActiveText,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          {statusFilters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterActiveText,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
          </View>
        )}
        // 4. Adicionar "puxar para atualizar"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[PINK]}
          />
        }
      />
    </View>
  );
}

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    pending: "#F59E0B",
    confirmed: "#3B82F6",
    production: "#8B5CF6",
    ready: "#10B981",
    delivered: "#6B7280",
    cancelled: "#EF4444",
  };
  return colors[status] || "#6B7280";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: PINK,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterContainer: {
    paddingHorizontal: 12,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  filterActive: {
    backgroundColor: PINK,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    textTransform: "capitalize",
  },
  filterActiveText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: "hidden",
  },
  statusIndicator: {
    width: 6,
    height: "100%",
  },
  orderInfo: {
    flex: 1,
    padding: 14,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  orderProduct: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
