import { createContext, useContext, useEffect, useState } from "react";
import { djangoApi } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    djangoApi
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await djangoApi.post("/auth/login/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (username, email, password) => {
    await djangoApi.post("/auth/register/", { username, email, password });
    return login(username, password);
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    try {
      if (refresh) await djangoApi.post("/auth/logout/", { refresh });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
