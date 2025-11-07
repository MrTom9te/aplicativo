import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import type React from "react";
import {
  createContext,
  type ReactNode,
  useCallback, // 1. Importar o useCallback
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";
import type { ErrorResponse, SucessResponse } from "@/types/api.types";
import type {
  AuthData,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth.types";

// ==================== CONTEXTO ====================

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: RegisterRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ==================== PROVEDOR ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Envolver a função signOut com useCallback
  // Como ela não depende de nada que muda, o array de dependências é vazio.
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      // Não propagamos o erro aqui para não quebrar o app em um simples logout
    }
  }, []);

  // Restaura a sessão ao iniciar o app
  useEffect(() => {
    const bootstrapAsync = async (): Promise<void> => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Se não houver token/usuário, garante que o estado esteja limpo
          await signOut();
        }
      } catch (e) {
        console.error("Falha ao restaurar a sessão do usuário", e);
        await signOut();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [signOut]); // 3. Adicionar signOut como dependência do useEffect

  // 4. Envolver a função signIn com useCallback
  const signIn = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await api.post<SucessResponse<AuthData>>(
          "/auth/login",
          credentials,
        );

        const { data } = response;

        if (data.success && data.data) {
          const { token: newToken, user: newUser } = data.data;

          await SecureStore.setItemAsync("token", newToken);
          await AsyncStorage.setItem("user", JSON.stringify(newUser));

          setUser(newUser);
        } else {
          throw new Error((data as any).error || "Email ou senha incorretos.");
        }
      } catch (error) {
        console.error("Erro no login:", error);
        await signOut();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signOut], // signIn depende de signOut
  );

  // 5. Envolver a função signUp com useCallback
  const signUp = useCallback(
    async (credentials: RegisterRequest): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await api.post("/auth/register", credentials);

        if (response.data.success) {
          await signIn({
            email: credentials.email,
            password: credentials.password,
          });
        } else {
          throw new Error(
            (response.data as ErrorResponse).error ||
              "Não foi possível registrar.",
          );
        }
      } catch (error) {
        console.error("Erro no registro:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [signIn], // signUp depende de signIn
  );

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== HOOK CUSTOMIZADO ====================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
