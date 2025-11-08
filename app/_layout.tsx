import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) {
      return; // Não faz nada enquanto o AuthContext está carregando
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (user && inAuthGroup) {
      // CORREÇÃO: Se o usuário está logado E AINDA ESTÁ no grupo de autenticação,
      // ele é redirecionado para a tela principal.
      router.replace("/(tabs)");
    } else if (!user && !inAuthGroup) {
      // Se o usuário NÃO está logado e NÃO está no grupo de autenticação,
      // ele é redirecionado para o login.
      router.replace("/(auth)/login");
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return null; // A tela de splash continua visível
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="products/new" options={{ title: "Novo Produto" }} />
        <Stack.Screen
          name="products/[id]"
          options={{ title: "Editar Produto" }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{ title: "Detalhes do Pedido" }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
