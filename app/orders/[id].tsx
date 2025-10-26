import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Order, OrderStatus } from "@/types/lib";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

// Mock de um pedido (em um app real, você buscaria isso da API usando o ID)
const mockOrder: Order = {
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
  status: "pendente",
  observations: "Sem corante artificial, por favor.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const order = mockOrder; // Usando o mock por enquanto

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Pedido não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={DARK_GRAY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`Pedido ${order.orderNumber}`}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(order.status) }]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {/* Seção Cliente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cliente</Text>
        <View style={styles.card}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.customerPhone}>{order.customerPhone}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons
                name="whatsapp"
                size={20}
                color="#25D366"
              />
              <Text style={styles.actionText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="phone" size={20} color={PINK} />
              <Text style={styles.actionText}>Ligar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Seção Pedido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes do Pedido</Text>
        <View style={styles.card}>
          <Text
            style={styles.productName}
          >{`${order.quantity}x ${order.productName}`}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Preço Unitário</Text>
            <Text
              style={styles.priceValue}
            >{`R$ ${order.unitPrice.toFixed(2)}`}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={[styles.priceLabel, styles.totalLabel]}>Total</Text>
            <Text
              style={[styles.priceValue, styles.totalValue]}
            >{`R$ ${order.totalPrice.toFixed(2)}`}</Text>
          </View>
        </View>
      </View>

      {/* Seção Entrega */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entrega</Text>
        <View style={styles.card}>
          <Text style={styles.deliveryDateTime}>
            {new Date(order.deliveryDate).toLocaleDateString("pt-BR")} às{" "}
            {order.deliveryTime}
          </Text>
          {order.observations && (
            <View style={styles.observationsContainer}>
              <Text style={styles.observationsTitle}>Observações:</Text>
              <Text style={styles.observationsText}>{order.observations}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    pendente: "#F59E0B",
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_GRAY,
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  customerPhone: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: DARK_GRAY,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    color: DARK_GRAY,
    fontWeight: "500",
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 16,
    color: PINK,
  },
  deliveryDateTime: {
    fontSize: 16,
    fontWeight: "500",
    color: DARK_GRAY,
  },
  observationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  observationsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
  observationsText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
