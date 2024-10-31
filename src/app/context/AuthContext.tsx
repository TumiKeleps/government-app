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
  id: string;
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10000 milliseconds = 10 seconds
    
      // Build the URL with query parameters
      // Replace with your backend URL

      const response = await fetch("http://192.168.8.6:8033/api/auth/login", {
        method: "POST", // Use 'GET' as per backend requirements
        headers: {
          "x-api-key": "opt-key-dev-2024", // Replace with your actual API key
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
     // Create an Error object and attach the status code
    const error: Error & { status?: number } = new Error(`Login failed`);
    error.status = response.status;
    throw error;
      }

      const data = await response.json();

      const userData: User = {
        id: data.id,
        name: data.name,
        surname: data.surname,
        email: data.email,
      };

      setIsAuthenticated(true);

      setUser(userData);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      if (error === "AbortError") {
        // Handle fetch abort (timeout)
        const timeoutError: Error & { status?: number } = new Error("Request timed out");
        timeoutError.status = 0; // Use 0 or a custom code for timeout
        throw timeoutError;
      } else if (error instanceof TypeError && error.message === "Failed to fetch") {
        // Handle network errors (e.g., backend is down)
        const networkError: Error & { status?: number } = new Error("Network error occurred");
        networkError.status = 0;
        throw networkError;
      } else {
        console.error("Login error:", error);
        throw error; // Re-throw to handle in the component
      }
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
