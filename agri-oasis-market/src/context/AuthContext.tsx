import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login, signup, User, UserRole } from "../lib/api";

export type { UserRole };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const isValidUser = (user: any): user is User => {
  return (
    user &&
    typeof user === "object" &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    ["farmer", "admin", "user"].includes(user.role) &&
    ["active", "pending", "suspended"].includes(user.status) &&
    typeof user.joinDate === "string" &&
    typeof user.sales === "number" &&
    typeof user.products === "number" &&
    typeof user.spent === "number" &&
    typeof user.orders === "number"
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log("Stored user in localStorage:", storedUser);
    console.log("Stored token in localStorage:", token);

    if (storedUser && token && typeof storedUser === "string" && storedUser.trim() !== "") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          throw new Error("Parsed user data does not match User interface");
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        console.error("Problematic storedUser value:", storedUser);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const loginHandler = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await login(email, password, role);
      console.log("Login API response:", response);
      const { token, user: fetchedUser } = response;
      if (!isValidUser(fetchedUser)) {
        console.error("Invalid user data:", fetchedUser);
        throw new Error("Received invalid user data from login API");
      }
      setUser(fetchedUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(fetchedUser));
      localStorage.setItem("token", token);
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw new Error(error.message || "Login failed");
    }
  };

  const signupHandler = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await signup(name, email, password, role);
      console.log("Signup API response:", response);
      const { token, user: newUser } = response;
      if (!isValidUser(newUser)) {
        console.error("Invalid user data:", newUser);
        throw new Error("Received invalid user data from signup API");
      }
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", token);
      return true;
    } catch (error: any) {
      console.error("Signup failed:", error.message);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    isAuthenticated,
    login: loginHandler,
    signup: signupHandler,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};