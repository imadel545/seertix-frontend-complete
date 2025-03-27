"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

/**
 * ✅ Décode proprement un token JWT
 */
function decodeToken(token) {
  try {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
      throw new Error("Format de token JWT invalide");
    }
    const base64Payload = token.split(".")[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded;
  } catch (err) {
    console.error("❌ Token invalide :", err.message);
    return null;
  }
}

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * ✅ Initialisation automatique au chargement
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser({ token, ...payload });
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  /**
   * ✅ Méthode d’authentification après le login
   * Appelée depuis le `login/page.js`
   */
  const login = useCallback((token) => {
    const payload = decodeToken(token);
    if (payload) {
      localStorage.setItem("token", token);
      setUser({ token, ...payload });
    } else {
      throw new Error("Échec de décodage du token.");
    }
  }, []);

  /**
   * ✅ Déconnexion complète
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
