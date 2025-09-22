
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerProducts from "./pages/farmer/Products";
import FarmerOrders from "./pages/farmer/Orders";
import FarmerAnalytics from "./pages/farmer/Analytics";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFarmers from "./pages/admin/Farmers";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";
import UserDashboard from "./pages/user/Dashboard";
import UserProducts from "./pages/user/Products";
import UserOrders from "./pages/user/Orders";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Farmer Routes */}
            <Route 
              path="/farmer" 
              element={
                <ProtectedRoute role="farmer">
                  <Navigate to="/farmer/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer/dashboard" 
              element={
                <ProtectedRoute role="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer/products" 
              element={
                <ProtectedRoute role="farmer">
                  <FarmerProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer/orders" 
              element={
                <ProtectedRoute role="farmer">
                  <FarmerOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farmer/analytics" 
              element={
                <ProtectedRoute role="farmer">
                  <FarmerAnalytics />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/farmers" 
              element={
                <ProtectedRoute role="admin">
                  <AdminFarmers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute role="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute role="admin">
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            
            {/* User Routes */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute role="user">
                  <Navigate to="/user/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/products" 
              element={
                <ProtectedRoute role="user">
                  <UserProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/orders" 
              element={
                <ProtectedRoute role="user">
                  <UserOrders />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
