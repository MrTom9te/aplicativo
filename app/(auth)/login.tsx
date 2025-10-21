// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#FAFAFA";
const DARK_GRAY = "#333333";

/**
 * @file app/(auth)/login.tsx
 * @brief Tela de Login para autenticação de utilizadores.
 *
 * Este componente permite que os utilizadores insiram seu email e senha para fazer login na aplicação.
 * Ele gerencia o estado dos campos de entrada, o estado de carregamento durante a tentativa de login,
 * e exibe alertas em caso de erros de validação ou de autenticação.
 * Integra-se com o `AuthContext` para realizar a operação de `signIn`.
 * Também fornece um link para a tela de registro de novos utilizadores.
 *
 * @component LoginScreen
 *
 * @returns {JSX.Element} Uma tela de login com campos para email e senha,
 * botões de login e de navegação para registro.
 *
 * @example
 * // Este componente é uma tela e deve ser usado como uma rota dentro do `expo-router`.
 * // Ex: No arquivo `app/(auth)/_layout.tsx`, ele é referenciado como:
 * // <Stack.Screen name="login" options={{ title: "Login" }} />
 */
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      setIsLoading(true);
      await signIn({ email, password });
    } catch (error) {
      Alert.alert("Erro de Login", "Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/Título */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>ConfeitApp</Text>
          <Text style={styles.subtitle}>Gerencie sua confeitaria</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu.email@confeitaria.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Não tem conta?</Text>
            <View style={styles.line} />
          </View>

          {/* Botão Register */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            disabled={isLoading}
          >
            <Link href="/(auth)/register" asChild>
              <Text style={styles.secondaryButtonText}>Criar Conta</Text>
            </Link>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Comece a vender seus bolos agora mesmo
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: PINK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "white",
    color: DARK_GRAY,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: PINK,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: PINK,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: PINK,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});
