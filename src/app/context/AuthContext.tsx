// src/app/context/AuthContext.tsx
"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

import { useSnackbar } from "./SnackBar";

interface User {
  name: string;
  surname: string;
  email: string;
  // Add other user properties if needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { showMessage } = useSnackbar();
  useEffect(() => {
    // Check if the user is authenticated from localStorage
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem('user');
    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Build the URL with query parameters
      // Replace with your backend URL

      const response = await fetch("http://192.168.8.6:8033/api/auth/login", {
        method: "POST", // Use 'GET' as per backend requirements
        headers: {
          "x-api-key": "opt-key-dev-2024", // Replace with your actual API key
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed  ${response.status}`);
      }

      const data = await response.json();

      const userData: User = {
        name: data.name,
        surname: data.surname,
        email: data.email,
      };

      setIsAuthenticated(true);

      setUser(userData);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to handle in the component
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem('user');
  showMessage("Successfully logged out!", "info", 5000)
    router.push('/login');
  };

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      user,
    }),
    [isAuthenticated, login, logout, user]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
