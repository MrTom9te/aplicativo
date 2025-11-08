import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import type React from "react";
import { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import type { Order, OrderStatus } from "@/types/orders.types";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

export default function HomeScreen() {
  const { user } = useAuth();
  const {
    products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useProducts();
  const {
    orders,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useOrders();

  const isRefreshing = isLoadingProducts || isLoadingOrders;

  const onRefresh = () => {
    refetchProducts();
    refetchOrders();
  };

  // Usamos useMemo para calcular os dados do resumo de forma eficiente
  const summaryData = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    const pedidosHoje = orders.filter(
      (order) => new Date(order.createdAt).setHours(0, 0, 0, 0) === today,
    );

    const pedidosPendentes = orders.filter(
      (order) => order.status === "pending",
    );

    const produtosAtivos = products.filter((product) => product.isActive);

    const ultimoPedido = orders.length > 0 ? orders[0] : null;

    return {
      pedidosHoje: pedidosHoje.length,
      pedidosPendentes: pedidosPendentes.length,
      produtosAtivos: produtosAtivos.length,
      ultimoPedido: ultimoPedido
        ? {
            cliente: ultimoPedido.customerName,
            tempo: `Pedido #${ultimoPedido.orderNumber}`,
          }
        : { cliente: "Nenhum pedido", tempo: "ainda" },
      recentOrders: pedidosHoje.slice(0, 3), // Pega os 3 primeiros de hoje
    };
  }, [orders, products]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (isRefreshing && !orders.length && !products.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.welcomeHeader}>
        <Text style={styles.greeting}>{`${getGreeting()}, ${
          user?.name.split(" ")[0]
        }!`}</Text>
        <Text style={styles.welcomeMessage}>
          Aqui está o resumo do seu dia:
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          icon="package-variant-closed"
          title="Pedidos Hoje"
          value={summaryData.pedidosHoje}
          color="#3B82F6"
        />
        <SummaryCard
          icon="clock-alert-outline"
          title="Pendentes"
          value={summaryData.pedidosPendentes}
          color="#F59E0B"
        />
        <SummaryCard
          icon="cake-variant"
          title="Produtos Ativos"
          value={summaryData.produtosAtivos}
          color="#10B981"
        />
        <SummaryCard
          icon="receipt"
          title="Último Pedido"
          text={summaryData.ultimoPedido.cliente}
          subtext={summaryData.ultimoPedido.tempo}
          color="#8B5CF6"
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pedidos de Hoje</Text>
          <Link href="/(tabs)/orders" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver Todos</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {summaryData.recentOrders.length > 0 ? (
          <View style={styles.orderList}>
            {summaryData.recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum pedido hoje.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// --- Componentes Auxiliares (SummaryCard, OrderCard, etc.) ---

interface SummaryCardProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  color: string;
  value?: number;
  text?: string;
  subtext?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  text,
  subtext,
  color,
}) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <MaterialCommunityIcons name={icon} size={28} color={color} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      {value !== undefined && <Text style={styles.cardValue}>{value}</Text>}
      {text && <Text style={styles.cardText}>{text}</Text>}
      {subtext && <Text style={styles.cardSubtext}>{subtext}</Text>}
    </View>
  </View>
);

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <Link href={{ pathname: "/orders/[id]", params: { id: order.id } }} asChild>
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderClient}>{order.customerName}</Text>
        <Text style={styles.orderProduct}>{order.productName}</Text>
      </View>
      <View style={styles.orderStatusContainer}>
        <Text
          style={[
            styles.orderStatus,
            getStatusStyle(order.status as OrderStatus),
          ]}
        >
          {order.status}
        </Text>
        <Text style={styles.orderTime}>{order.deliveryTime}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return { color: "#D97706", backgroundColor: "#FEF3C7" };
    case "confirmed":
      return { color: "#2563EB", backgroundColor: "#DBEAFE" };
    case "production":
      return { color: "#7C3AED", backgroundColor: "#EDE9FE" };
    case "ready":
      return { color: "#059669", backgroundColor: "#D1FAE5" };
    default:
      return { color: "#4B5563", backgroundColor: "#F3F4F6" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeHeader: {
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -6,
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: DARK_GRAY,
    marginTop: 4,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  cardSubtext: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: PINK,
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderClient: {
    fontSize: 16,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  orderProduct: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  orderStatusContainer: {
    alignItems: "flex-end",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  orderTime: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
