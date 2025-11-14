import { Text, View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <Link href="/settings/store" asChild>
        <Pressable style={styles.menuItem}>
          <View style={styles.menuItemTextContainer}>
            <Text style={styles.menuItemText}>Personalizar minha loja</Text>
            <Text style={styles.menuItemSubtext}>
              Aparência, endereço e entregas
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuItemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
