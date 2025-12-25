import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { showSuccess, showError } from "@/utils/toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.access_token);
      showSuccess("Successfully signed in with Google!");
    } catch (error) {
      console.error("Login error:", error);
      showError("Failed to login with Google.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    showSuccess("Logged out successfully.");
  };

  const continueAsGuest = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/guest`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Guest login failed");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.access_token);
      showSuccess("Continuing as guest.");
    } catch (error) {
      console.error("Guest login error:", error);
      showError("Failed to continue as guest.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};