import { createContext, useContext, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminContextType = {
  isAdmin: boolean;
  adminEmail: string | null;
  adminRole: string | null;
  adminName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  setAdminSession: (email: string, role: string, name: string) => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "hh_admin";
const ADMIN_ROLE_KEY = "hh_admin_role";
const ADMIN_NAME_KEY = "hh_admin_name";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try { return localStorage.getItem(ADMIN_KEY); } catch { return null; }
  });
  const [adminRole, setAdminRole] = useState<string | null>(() => {
    try { return localStorage.getItem(ADMIN_ROLE_KEY); } catch { return null; }
  });
  const [adminName, setAdminName] = useState<string | null>(() => {
    try { return localStorage.getItem(ADMIN_NAME_KEY); } catch { return null; }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("staff_users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("active", true)
      .single();

    if (error || !data) return false;

    localStorage.setItem(ADMIN_KEY, data.email);
    localStorage.setItem(ADMIN_ROLE_KEY, data.role);
    localStorage.setItem(ADMIN_NAME_KEY, data.name);
    setAdminEmail(data.email);
    setAdminRole(data.role);
    setAdminName(data.name);
    return true;
  };

  const setAdminSession = (email: string, role: string, name: string) => {
    localStorage.setItem(ADMIN_KEY, email);
    localStorage.setItem(ADMIN_ROLE_KEY, role);
    localStorage.setItem(ADMIN_NAME_KEY, name);
    setAdminEmail(email);
    setAdminRole(role);
    setAdminName(name);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(ADMIN_ROLE_KEY);
    localStorage.removeItem(ADMIN_NAME_KEY);
    setAdminEmail(null);
    setAdminRole(null);
    setAdminName(null);
  };

  return (
    <AdminContext.Provider value={{ isAdmin: !!adminEmail, adminEmail, adminRole, adminName, login, setAdminSession, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
