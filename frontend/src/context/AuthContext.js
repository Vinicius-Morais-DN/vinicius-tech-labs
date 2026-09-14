import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vm_token");
    if (!token) {
      setChecking(false);
      return;
    }
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("vm_token");
        setChecking(false);
      });
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });
      if (!res.data?.token) {
        const err = new Error("Resposta inválida do servidor — token ausente");
        err.response = { status: 502, data: { detail: err.message } };
        throw err;
      }
      localStorage.setItem("vm_token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("vm_token");
    setUser(null);
  };

  const forceLogout = () => {
    localStorage.removeItem("vm_token");
    setUser(null);
    window.location.href = "/admin";
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, forceLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
