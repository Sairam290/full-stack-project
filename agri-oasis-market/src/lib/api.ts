import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://localhost:8085/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url?.includes("/auth/")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Request:",
      config.method.toUpperCase(),
      config.url,
      "Headers:",
      config.headers
    );
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export type UserRole = "farmer" | "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  joinDate: string;
  sales: number;
  products: number;
  spent: number;
  orders: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  createdAt: string;
}

export interface Order {
  id: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  farmerId: string;
  userId: string;
  userName: string;
  userContact: string;
  shippingAddress: string;
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface CategorySales {
  name: string;
  value: number;
}

export const login = async (
  email: string,
  password: string,
  role: UserRole
): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post("/auth/login", { email, password, role });
    console.log("Raw login response:", response.data);
    if (!response.data.user || !response.data.token) {
      throw new Error("Login response missing user or token data");
    }
    return {
      token: response.data.token,
      user: {
        ...response.data.user,
        sales: Number(response.data.user.sales) || 0,
        products: Number(response.data.user.products) || 0,
        spent: Number(response.data.user.spent) || 0,
        orders: Number(response.data.user.orders) || 0,
      },
    };
  } catch (error: any) {
    console.error("Login API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login request failed");
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
      role,
    });
    console.log("Raw signup response:", response.data);
    if (!response.data.user || !response.data.token) {
      throw new Error("Signup response missing user or token data");
    }
    return {
      token: response.data.token,
      user: {
        ...response.data.user,
        sales: Number(response.data.user.sales) || 0,
        products: Number(response.data.user.products) || 0,
        spent: Number(response.data.user.spent) || 0,
        orders: Number(response.data.user.orders) || 0,
      },
    };
  } catch (error: any) {
    console.error("Signup API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Signup request failed");
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data.map((product: any) => ({
    ...product,
    rating: product.rating || 0,
  }));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrdersByFarmer = async (farmerId: string): Promise<Order[]> => {
  const response = await api.get(`/orders/farmer/${farmerId}`);
  return response.data;
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const getMonthlySales = async (
  farmerId: string
): Promise<MonthlySales[]> => {
  const response = await api.get(`/farmer/analytics/sales/monthly/${farmerId}`);
  return response.data;
};

export const getCategorySales = async (
  farmerId: string
): Promise<CategorySales[]> => {
  const response = await api.get(`/farmer/analytics/sales/product/${farmerId}`);
  return response.data;
};

export const getFarmers = async (): Promise<User[]> => {
  const response = await api.get("/admin/farmers");
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<User> => {
  const response = await api.put(`/admin/users/${userId}/status`, { status });
  return response.data;
};

export default api;
