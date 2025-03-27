"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Hook personnalisé pour accéder au contexte d'authentification.
 * @returns {{ user: object, login: function, logout: function, isAuthenticated: boolean, loading: boolean }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
