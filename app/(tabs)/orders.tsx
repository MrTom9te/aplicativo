import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Order, OrderStatus } from "@/types/lib";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

// Dados mocados
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PED-001",
    customerName: "Carlos Pereira",
    customerPhone: "5592999887766",
    productId: "1",
    productName: "Bolo de Chocolate",
    quantity: 1,
    unitPrice: 45.0,
    totalPrice: 45.0,
    deliveryDate: "2025-10-16",
    deliveryTime: "14:00",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    orderNumber: "PED-002",
    customerName: "Juliana Costa",
    customerPhone: "5592999887766",
    productId: "2",
    productName: "Torta de Limão",
    quantity: 2,
    unitPrice: 25.0,
    totalPrice: 50.0,
    deliveryDate: "2025-10-16",
    deliveryTime: "16:30",
    status: "production",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    orderNumber: "PED-003",
    customerName: "Marcos Lima",
    customerPhone: "5592999887766",
    productId: "3",
    productName: "Caixa de Brigadeiros",
    quantity: 1,
    unitPrice: 30.0,
    totalPrice: 30.0,
    deliveryDate: "2025-10-17",
    deliveryTime: "11:00",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    orderNumber: "PED-004",
    customerName: "Fernanda Alves",
    customerPhone: "5592999887766",
    productId: "4",
    productName: "Bolo de Cenoura",
    quantity: 1,
    unitPrice: 40.0,
    totalPrice: 40.0,
    deliveryDate: "2025-10-18",
    deliveryTime: "10:00",
    status: "delivered",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const statusFilters: OrderStatus[] = [
  "pending",
  "confirmed",
  "production",
  "ready",
];

/**
 * @file app/(tabs)/orders.tsx
 * @brief Tela de Pedidos da confeiteira.
 *
 * Este componente exibe uma lista de todos os pedidos recebidos pela confeiteira,
 * permitindo a filtragem por status (pendente, confirmado, em produção, pronto).
 * Cada pedido na lista é um item clicável que leva para a tela de detalhes do pedido.
 * Utiliza dados mocados para simular os pedidos.
 *
 * @component OrdersScreen
 *
 * @returns {JSX.Element} Uma tela que mostra uma lista filtrável de pedidos.
 *
 * @example
 * // Este componente é uma tela e deve ser usado como uma rota dentro do `expo-router`
 * // e renderizado como uma aba, conforme configurado em `app/(tabs)/_layout.tsx`.
 * // <Tabs.Screen name="orders" options={{ title: "Pedidos" }} />
 */
export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "Todos">("Todos");

  const filteredOrders = orders.filter((o) => {
    if (filter === "Todos") return true;
    return o.status === filter;
  });

  /**
   * @brief Renderiza um único item de pedido para a `FlatList`.
   *
   * Esta função é passada para a propriedade `renderItem` da `FlatList`.
   * Ela recebe um objeto contendo o item do pedido e retorna um componente JSX
   * que exibe as informações do pedido e é clicável, levando para a tela
   * de detalhes do pedido.
   *
   * @param {{ item: Order }} props - As propriedades passadas pela `FlatList`, contendo o item do pedido.
   * @returns {JSX.Element} Um componente `TouchableOpacity` que representa um cartão de pedido.
   */
  const renderOrder = ({ item }: { item: Order }) => (
    <Link href={{ pathname: "./orders/[id]", params: { id: item.id } }} asChild>
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
              {new Date(item.deliveryDate).toLocaleDateString("pt-BR")} às{" "}
              {item.deliveryTime}
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

  return (
    <View style={styles.container}>
      {/* Filtros de Status */}
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
      />
    </View>
  );
}

/**
 * @brief Retorna uma cor hexadecimal baseada no status do pedido.
 * @param {OrderStatus} status - O status do pedido (e.g., "pending", "confirmed", "production").
 * @returns {string} Uma string de cor hexadecimal.
 */
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
