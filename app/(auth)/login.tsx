import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#FAFAFA";
const DARK_GRAY = "#333333";
const RED_ERROR = "#D32F2F";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1. O estado de erro para exibir a mensagem da API
  const [error, setError] = useState<string | null>(null);

  // 2. Pegamos o 'signIn' e também o 'isLoading' do nosso contexto
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha o email e a senha.");
      return;
    }

    try {
      setError(null); // Limpa erros anteriores
      await signIn({ email, password });
      // A navegação será tratada pelo AuthContext/Router, não precisamos fazer nada aqui
    } catch (e: any) {
      // 3. Captura o erro da API e o define no estado
      setError(e.message || "Ocorreu um erro desconhecido.");
    }
    // O 'isLoading' já é gerenciado pelo AuthContext, não precisamos do finally
  };

  // Função para limpar o erro ao focar em um input
  const clearErrorOnFocus = () => {
    if (error) {
      setError(null);
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
        <View style={styles.headerSection}>
          <Text style={styles.title}>ConfeitApp</Text>
          <Text style={styles.subtitle}>Gerencie sua confeitaria</Text>
        </View>

        <View style={styles.formSection}>
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
              onFocus={clearErrorOnFocus} // Limpa o erro ao digitar
            />
          </View>

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
              onFocus={clearErrorOnFocus} // Limpa o erro ao digitar
            />
          </View>

          {/* 4. Componente para exibir a mensagem de erro */}
          {error && <Text style={styles.errorText}>{error}</Text>}

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

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Não tem conta?</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            disabled={isLoading}
          >
            <Link href="/(auth)/register" asChild>
              <Text style={styles.secondaryButtonText}>Criar Conta</Text>
            </Link>
          </TouchableOpacity>
        </View>

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
  // Estilo para o texto de erro
  errorText: {
    color: RED_ERROR,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
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
