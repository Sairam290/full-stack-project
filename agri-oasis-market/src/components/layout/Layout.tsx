
import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
  title: string;
  role: "farmer" | "admin" | "user";
}

const Layout = ({ children, title, role }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/favicon.ico" 
              alt="AgriOasis" 
              className="w-8 h-8" 
            />
            <h1 className="text-xl font-poppins text-agri-green-dark font-semibold">
              AgriOasis Market
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-agri-brown-dark hover:text-agri-brown-light"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md z-10 hidden md:block">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-agri-green-dark">{role === 'user' ? 'Buyer' : role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              <li>
                <Link 
                  to={`/${role}/dashboard`} 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                >
                  <span className="mr-2">📊</span>
                  Dashboard
                </Link>
              </li>
              
              {role === "farmer" && (
                <>
                  <li>
                    <Link 
                      to="/farmer/products" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">🥕</span>
                      My Products
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/farmer/orders" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">📦</span>
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/farmer/analytics" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">📈</span>
                      Analytics
                    </Link>
                  </li>
                </>
              )}
              
              {role === "admin" && (
                <>
                  <li>
                    <Link 
                      to="/admin/farmers" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">👨‍🌾</span>
                      Farmers
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/users" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">👥</span>
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/products" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">🥕</span>
                      Products
                    </Link>
                  </li>
                </>
              )}
              
              {role === "user" && (
                <>
                  <li>
                    <Link 
                      to="/user/products" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">🥕</span>
                      Shop Products
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/user/orders" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-agri-green-light/10 hover:text-agri-green-dark rounded-md transition-all"
                    >
                      <span className="mr-2">📦</span>
                      My Orders
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </aside>
        
        {/* Mobile sidebar - will be implemented with a drawer in a real app */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10">
          <Link 
            to={`/${role}/dashboard`} 
            className="flex flex-col items-center p-2 text-sm"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          
          {role === "farmer" && (
            <>
              <Link 
                to="/farmer/products" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>🥕</span>
                <span>Products</span>
              </Link>
              <Link 
                to="/farmer/orders" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>📦</span>
                <span>Orders</span>
              </Link>
            </>
          )}
          
          {role === "admin" && (
            <>
              <Link 
                to="/admin/farmers" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>👨‍🌾</span>
                <span>Farmers</span>
              </Link>
              <Link 
                to="/admin/users" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>👥</span>
                <span>Users</span>
              </Link>
            </>
          )}
          
          {role === "user" && (
            <>
              <Link 
                to="/user/products" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>🥕</span>
                <span>Shop</span>
              </Link>
              <Link 
                to="/user/orders" 
                className="flex flex-col items-center p-2 text-sm"
              >
                <span>📦</span>
                <span>Orders</span>
              </Link>
            </>
          )}
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-6 pb-16 md:pb-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-agri-brown-dark">{title}</h1>
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>&copy; 2023 AgriOasis Market. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
