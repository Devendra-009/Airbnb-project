import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try { const { data } = await api.get("/auth/me"); setUser(data.user); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function login(values) {
    const { data } = await api.post("/auth/login", values);
    setUser(data.user); return data.user;
  }
  async function register(values) {
    const { data } = await api.post("/auth/register", values);
    setUser(data.user); return data.user;
  }
  async function logout() {
    await api.post("/auth/logout"); setUser(null);
  }
  return <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refresh }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
