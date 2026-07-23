import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCurrentUser, setCurrentUser, logoutUser as doLogout, type User } from "@/lib/storage";

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getCurrentUser);

  const setUser = (u: User | null) => {
    setCurrentUser(u);
    setUserState(u);
  };

  const logout = () => {
    doLogout();
    setUserState(null);
  };

  // Removed cross-tab sync to allow different logins in different tabs

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
