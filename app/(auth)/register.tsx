// app/(auth)/register.tsx
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
import { Link, useRouter } from "expo-router";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#FAFAFA";
const DARK_GRAY = "#333333";

/**
 * @file app/(auth)/register.tsx
 * @brief Tela de Registro de Utilizadores.
 *
 * Este componente permite que novas confeiteiras criem uma conta na aplicação.
 * Ele coleta informações como nome, email, telefone, senha e confirmação de senha.
 * Realiza validações básicas nos campos de entrada e gerencia o estado de carregamento
 * durante a tentativa de registro. Integra-se com o `AuthContext` para a operação de `signUp`.
 * Em caso de sucesso, navega o utilizador para a tela de login.
 *
 * @component RegisterScreen
 *
 * @returns {JSX.Element} Uma tela de registro com campos para as informações do utilizador,
 * botões de registro e de navegação para login.
 *
 * @example
 * // Este componente é uma tela e deve ser usado como uma rota dentro do `expo-router`.
 * // Ex: No arquivo `app/(auth)/_layout.tsx`, ele é referenciado como:
 * // <Stack.Screen name="register" options={{ title: "Registrar" }} />
 */
export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Erro", "Senha deve ter no mínimo 8 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não correspondem");
      return false;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      Alert.alert("Erro", "Telefone inválido");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signUp({ name, email, password, phone });
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Erro ao Registrar", "Tente novamente com outro email");
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
        {/* Voltar */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
        </Link>

        {/* Título */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece a vender seus bolos</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          {/* Campo Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Maria Silva"
              placeholderTextColor="#999"
              autoCapitalize="words"
              editable={!isLoading}
              value={name}
              onChangeText={setName}
            />
          </View>

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

          {/* Campo Telefone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(55) 92999887766"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              editable={!isLoading}
              value={phone}
              onChangeText={setPhone}
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
            <Text style={styles.hint}>Mínimo 8 caracteres</Text>
          </View>

          {/* Campo Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isLoading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Botão Registrar */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Fazer Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Seus dados estão protegidos e seguros
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: PINK,
    fontWeight: "600",
  },
  headerSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: DARK_GRAY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  formSection: {
    gap: 12,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 8,
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
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: PINK,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: PINK,
    fontWeight: "600",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
