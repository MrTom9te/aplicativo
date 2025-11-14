import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/products.types";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#F7F7F7";
const DARK_GRAY = "#333333";

export default function ProductsScreen() {
  const { products, isLoading, error, refetch, toggleProductStatus } =
    useProducts();

  const [filter, setFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filter === "Ativos") return p.isActive;
        if (filter === "Inativos") return !p.isActive;
        return true;
      })
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, filter, searchQuery]);

  const renderProduct = ({ item }: { item: Product }) => {
    const getImageUrl = (imageName: string | undefined) => {
      if (!imageName) {
        return "https://via.placeholder.com/60"; // Imagem de placeholder se não houver nome
      }
      // Assumindo que imageName é apenas o nome do arquivo (ex: "bolo_chocolate.jpg")
      // e que seu servidor estático serve imagens de /static/images/
      return `/static/images/${item.id}`;
    };

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text
            style={styles.productPrice}
          >{`R$ ${item.price.toFixed(2)}`}</Text>
        </View>
        <View style={styles.productActions}>
          <Switch
            value={item.isActive}
            onValueChange={(newStatus) =>
            {console.log("call ToggleProductStatus");  toggleProductStatus(item.id, newStatus);}
            }
            trackColor={{ false: "#ccc", true: "#fcd4e7" }}
            thumbColor={item.isActive ? PINK : "#f4f3f4"}
          />
          <Link
            href={{ pathname: "/products/[id]", params: { id: item.id } }}
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
  };

  if (isLoading && !products.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
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
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
            <Text style={styles.emptySubText}>
              Use o botão '+' para adicionar seu primeiro produto.
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[PINK]}
          />
        }
      />

      <Link href="/products/new" asChild>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
});
