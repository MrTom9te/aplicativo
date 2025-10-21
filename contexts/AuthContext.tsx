import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiErrorResponse,
} from "@/types/lib";

const API_BASE = "http://localhost:3000/api";

// ==================== CONTEXT ====================

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: RegisterRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura token ao iniciar
  useEffect(() => {
    const bootstrapAsync = async (): Promise<void> => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to restore token", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login
  const signIn = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse | ApiErrorResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Login failed");
      }

      if ("data" in data && "token" in data.data && "user" in data.data) {
        const { token: newToken, user: newUser } = data.data;

        await AsyncStorage.setItem("userToken", newToken);
        await AsyncStorage.setItem("userData", JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Registro
  const signUp = async (credentials: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Registration failed");
      }

      // Após registro, faz login automaticamente
      await signIn({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    token,
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
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
