import React, { JSX } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

// Dados mocados
const summaryData = {
  pedidosHoje: 5,
  pedidosPendentes: 2,
  produtosAtivos: 12,
  ultimoPedido: {
    cliente: "Ana Souza",
    tempo: "há 15 minutos",
  },
};

const recentOrders = [
  {
    id: "1",
    cliente: "Carlos Pereira",
    produto: "Bolo de Chocolate",
    status: "Pendente",
    hora: "14:00",
  },
  {
    id: "2",
    cliente: "Juliana Costa",
    produto: "Torta de Limão",
    status: "Em Produção",
    hora: "16:30",
  },
  {
    id: "3",
    cliente: "Marcos Lima",
    produto: "Caixa de Brigadeiros",
    status: "Pronto",
    hora: "11:00",
  },
];

/**
 * @file app/(tabs)/index.tsx
 * @brief Tela inicial (Dashboard) da aplicação para a confeiteira.
 *
 * Este componente serve como o dashboard principal, exibindo um resumo do dia da confeiteira.
 * Inclui informações sobre pedidos (feitos hoje, pendentes), produtos ativos e o último pedido recebido.
 * Também lista os pedidos recentes e fornece um link para a tela de 'Meus Pedidos'.
 *
 * @component HomeScreen
 *
 * @returns {JSX.Element} Uma tela de dashboard com cards de resumo e uma lista de pedidos recentes.
 *
 * @example
 * // Este componente é uma tela e deve ser usado como uma rota dentro do `expo-router`
 * // e renderizado como uma aba, conforme configurado em `app/(tabs)/_layout.tsx`.
 * // <Tabs.Screen name="index" options={{ title: "Início", headerTitle: "Dashboard" }} />
 */
export default function HomeScreen() {
  const { user } = useAuth();

  /**
   * @brief Retorna uma saudação apropriada baseada na hora atual do dia.
   * @returns {string} Uma string de saudação (e.g., "Bom dia", "Boa tarde", "Boa noite").
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header de boas-vindas */}
      <View style={styles.welcomeHeader}>
        <Text
          style={styles.greeting}
        >{`${getGreeting()}, ${user?.name.split(" ")[0]}!`}</Text>
        <Text style={styles.welcomeMessage}>
          Aqui está o resumo do seu dia:
        </Text>
      </View>

      {/* Cards de Resumo */}
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

      {/* Lista de Pedidos Recentes */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pedidos de Hoje</Text>
          <Link href="/(tabs)/orders" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver Todos</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {recentOrders.length > 0 ? (
          <View style={styles.orderList}>
            {(recentOrders as RecentOrder[]).map((order: RecentOrder) => (
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

// Tipos locais para os componentes
interface RecentOrder {
  id: string;
  cliente: string;
  produto: string;
  status: "Pendente" | "Em Produção" | "Pronto";
  hora: string;
}

/**
 * @typedef {object} SummaryCardProps
 * @property {React.ComponentProps<typeof MaterialCommunityIcons>["name"]} icon - Nome do ícone da comunidade de materiais a ser exibido no cartão.
 * @property {string} title - Título do cartão de resumo.
 * @property {string} color - Cor primária do cartão (usada para o ícone e a borda esquerda).
 * @property {number} [value] - Valor numérico a ser exibido no cartão (opcional).
 * @property {string} [text] - Texto principal a ser exibido no cartão (opcional, usado em vez de `value`).
 * @property {string} [subtext] - Subtexto a ser exibido abaixo do texto principal (opcional).
 */
interface SummaryCardProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  color: string;
  value?: number;
  text?: string;
  subtext?: string;
}

/**
 * @brief Um cartão de resumo reutilizável para exibir estatísticas ou informações rápidas.
 *
 * @component SummaryCard
 * @param {SummaryCardProps} props - As propriedades para configurar o cartão de resumo.
 * @returns {JSX.Element} Um cartão de resumo estilizado com ícone, título e valor/texto.
 */
const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  text,
  subtext,
  color,
}: SummaryCardProps): JSX.Element => (
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

/**
 * @brief Um cartão reutilizável para exibir informações de um único pedido recente.
 *
 * @component OrderCard
 * @param {{ order: RecentOrder }} props - As propriedades contendo os dados do pedido.
 * @returns {JSX.Element} Um componente de cartão de pedido clicável.
 */
const OrderCard: React.FC<{ order: RecentOrder }> = ({ order }) => (
  <TouchableOpacity style={styles.orderCard}>
    <View style={styles.orderInfo}>
      <Text style={styles.orderClient}>{order.cliente}</Text>
      <Text style={styles.orderProduct}>{order.produto}</Text>
    </View>
    <View style={styles.orderStatusContainer}>
      <Text style={[styles.orderStatus, getStatusStyle(order.status)]}>
        {order.status}
      </Text>
      <Text style={styles.orderTime}>{order.hora}</Text>
    </View>
  </TouchableOpacity>
);

/**
 * @brief Retorna um objeto de estilo condicional com base no status do pedido.
 * @param {RecentOrder["status"]} status - O status do pedido ('Pendente', 'Em Produção', 'Pronto').
 * @returns {object} Um objeto contendo `color` e `backgroundColor` para o status.
 */
const getStatusStyle = (status: RecentOrder["status"]) => {
  switch (status) {
    case "Pendente":
      return { color: "#F59E0B", backgroundColor: "#FEF3C7" };
    case "Em Produção":
      return { color: "#3B82F6", backgroundColor: "#DBEAFE" };
    case "Pronto":
      return { color: "#10B981", backgroundColor: "#D1FAE5" };
    default:
      return { color: "#6B7280", backgroundColor: "#F3F4F6" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    paddingHorizontal: 16,
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
    overflow: "hidden", // Garante que o borderRadius funcione no Text
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
