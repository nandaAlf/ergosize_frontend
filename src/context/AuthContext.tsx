// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../api/ApiService";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
  loading: boolean; // Nuevo estado para manejar la carga inicial
}

const AuthContext = createContext<AuthContextType>(null!);
// api/auth.ts
const verifyToken = async (token: string) => {
  const response = await ApiService.get("accounts/users/me/");
  // if (!response.ok) {
  //   throw new Error('Token inválido');
  // }
  console.log("userData", response);

  return response.data;
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado de carga inicial

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          // Verifica el token con el backend
          const userData = await verifyToken(token);
          console.log("userDta", userData);
          setUser(userData);
        } catch (error) {
          console.error("Error verifying token:", error);
          logout();
        }
      }
      setLoadingAuth(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const value = { user, setUser, logout, loading: loadingAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
