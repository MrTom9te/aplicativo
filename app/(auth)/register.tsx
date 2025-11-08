import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";

const PINK = "#FF69B4";
const LIGHT_GRAY = "#FAFAFA";
const DARK_GRAY = "#333333";
const RED_ERROR = "#D32F2F";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Usando o signUp e isLoading do contexto
  const { signUp, isLoading } = useAuth();

  // Validação agora retorna uma mensagem de erro ou null
  const validateForm = (): string | null => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      return "Por favor, preencha todos os campos.";
    }
    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }
    if (password !== confirmPassword) {
      return "As senhas não correspondem.";
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return "O formato do telefone é inválido.";
    }
    return null; // Formulário válido
  };

  const handleRegister = async () => {
    setError(null); // Limpa erros antigos
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await signUp({ name, email, password, phone });
      // Sucesso! O AuthContext e o Router cuidarão do resto.
    } catch (e: any) {
      setError(e.message || "Não foi possível criar a conta.");
    }
  };

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
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.backButton} disabled={isLoading}>
            <Text style={styles.backText}>← Voltar para Login</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece a vender seus bolos</Text>
        </View>

        <View style={styles.formSection}>
          {/* Campos do formulário... */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Maria Silva"
              editable={!isLoading}
              value={name}
              onChangeText={setName}
              onFocus={clearErrorOnFocus}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu.email@confeitaria.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              value={email}
              onChangeText={setEmail}
              onFocus={clearErrorOnFocus}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(dd) 9 9988-7766"
              keyboardType="phone-pad"
              editable={!isLoading}
              value={phone}
              onChangeText={setPhone}
              onFocus={clearErrorOnFocus}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              editable={!isLoading}
              value={password}
              onChangeText={setPassword}
              onFocus={clearErrorOnFocus}
            />
            <Text style={styles.hint}>Mínimo 8 caracteres</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              editable={!isLoading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={clearErrorOnFocus}
            />
          </View>

          {/* Exibição de Erro */}
          {error && <Text style={styles.errorText}>{error}</Text>}

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

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Fazer Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.footerSection} />
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
  errorText: {
    color: RED_ERROR,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
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
    height: 30,
  },
});
