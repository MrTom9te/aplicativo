import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const PINK = "#FF69B4";

/**
 * @file app/(tabs)/_layout.tsx
 * @brief Layout principal para as telas com navegação por abas na aplicação.
 *
 * Este componente define a estrutura de navegação por abas (`Tabs`) para as
 * principais seções da aplicação (Início/Dashboard, Produtos e Pedidos).
 * Ele configura o estilo visual das abas, incluindo cores de ícones e texto,
 * o estilo da barra de abas e as opções de cabeçalho para cada tela.
 *
 * @component TabLayout
 *
 * @returns {JSX.Element} Um componente `Tabs` do `expo-router` configurado
 * com as telas principais da aplicação.
 *
 * @example
 * // Este layout é automaticamente aplicado às rotas dentro do diretório (tabs).
 * // Não é necessário importá-lo ou usá-lo diretamente em outros componentes.
 * // As telas `index.tsx`, `products.tsx` e `orders.tsx` dentro de `(tabs)`
 * // serão renderizadas com este layout de abas.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PINK,
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 4,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "white",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          headerTitle: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Produtos",
          headerTitle: "Meus Produtos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cake-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          headerTitle: "Meus Pedidos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
