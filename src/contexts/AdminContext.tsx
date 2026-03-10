import { createContext, useContext, useState, type ReactNode } from "react";

type AdminContextType = {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "hh_admin";
const ADMIN_CREDENTIALS = { email: "admin@store.com", password: "admin123" };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_KEY);
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(ADMIN_KEY, email);
      setAdminEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setAdminEmail(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin: !!adminEmail, adminEmail, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
