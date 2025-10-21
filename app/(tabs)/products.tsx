import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

// Dados mocados para simular a lista de produtos
const mockProducts = [
  {
    id: "1",
    name: "Bolo de Chocolate",
    price: 45.0,
    imageUrl: "https://picsum.photos/seed/1/200",
    isActive: true,
  },
  {
    id: "2",
    name: "Torta de Morango",
    price: 55.5,
    imageUrl: "https://picsum.photos/seed/2/200",
    isActive: true,
  },
  {
    id: "3",
    name: "Caixa de Brigadeiros (20 un)",
    price: 30.0,
    imageUrl: "https://picsum.photos/seed/3/200",
    isActive: false,
  },
  {
    id: "4",
    name: "Bolo de Cenoura com Cobertura",
    price: 40.0,
    imageUrl: "https://picsum.photos/seed/4/200",
    isActive: true,
  },
];

/**
 * @typedef {object} Product
 * @property {string} id - O identificador único do produto.
 * @property {string} name - O nome do produto.
 * @property {number} price - O preço do produto.
 * @property {string} imageUrl - A URL da imagem do produto.
 * @property {boolean} isActive - O status do produto (ativo ou inativo).
 */
type Product = (typeof mockProducts)[0];

/**
 * @file app/(tabs)/products.tsx
 * @brief Tela de Produtos da confeiteira.
 *
 * Este componente exibe uma lista de todos os produtos cadastrados, permitindo
 * a filtragem por status (Todos, Ativos, Inativos) e uma busca por nome.
 * A confeiteira pode ativar/desativar um produto diretamente da lista e acessar
 * a tela de edição ou de criação de um novo produto.
 *
 * @component ProductsScreen
 *
 * @returns {JSX.Element} Uma tela para gerenciamento de produtos com lista, filtros e busca.
 *
 * @example
 * // Este componente é uma tela e deve ser usado como uma rota dentro do `expo-router`
 * // e renderizado como uma aba, conforme configurado em `app/(tabs)/_layout.tsx`.
 * // <Tabs.Screen name="products" options={{ title: "Produtos" }} />
 */
export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filter, setFilter] = useState("Todos");

  /**
   * @brief Alterna o status de um produto (ativo/inativo) com base no seu ID.
   * @param {string} id - O ID do produto a ser atualizado.
   */
  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const filteredProducts = products.filter((p) => {
    if (filter === "Ativos") return p.isActive;
    if (filter === "Inativos") return !p.isActive;
    return true;
  });

  /**
   * @brief Renderiza um único item de produto para a FlatList.
   * @param {{ item: Product }} props - As propriedades contendo o item do produto.
   * @returns {JSX.Element} Um componente de cartão de produto com informações e ações.
   */
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{`R$ ${item.price.toFixed(2)}`}</Text>
      </View>
      <View style={styles.productActions}>
        <Switch
          value={item.isActive}
          onValueChange={() => toggleProductStatus(item.id)}
          trackColor={{ false: "#ccc", true: "#fcd4e7" }}
          thumbColor={item.isActive ? PINK : "#f4f3f4"}
        />

        <Link
          href={{ pathname: "/products/:id", params: { id: item.id } }}
          asChild
        >
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barra de Busca e Filtros */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
          />
        </View>
        <View style={styles.filterContainer}>
          {["Todos", "Ativos", "Inativos"].map((f) => (
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
        </View>
      </View>

      <FlatList<Product>
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        )}
      />

      {/* Botão Flutuante para adicionar novo produto */}
      <Link href="./products/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 8,
    color: DARK_GRAY,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
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
  },
  filterActiveText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: DARK_GRAY,
  },
  productPrice: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
    fontWeight: "500",
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PINK,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
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
