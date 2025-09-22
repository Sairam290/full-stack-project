import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/shared/StatCard";
import { getOrdersByUser, Order } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role !== "user") {
        toast({
          title: "Error",
          description: "You must be logged in as a user to view this dashboard.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const userOrders = await getOrdersByUser(user.id);
        setOrders(userOrders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch your orders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  if (loading) return <div>Loading...</div>;

  // Calculate statistics
  const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => 
    order.status === "pending" || order.status === "confirmed" || order.status === "shipped"
  ).length;
  
  // Get the latest order
  const latestOrder = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
  
  return (
    <Layout title="My Dashboard" role="user">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon="💸"
          description="Lifetime purchases"
        />
        
        <StatCard 
          title="Orders Placed"
          value={totalOrders}
          icon="📦"
          description="Total orders made"
        />
        
        <StatCard 
          title="Active Orders"
          value={pendingOrders}
          icon="🚚"
          description="Orders being processed"
        />
      </div>
      
      {/* Welcome Card */}
      <Card className="mb-8 bg-gradient-to-br from-agri-green-light/20 to-agri-yellow/20 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-agri-brown-dark">Welcome back, {user?.name}!</h2>
            <p className="text-gray-600 mt-1">
              Browse fresh produce from local farmers and support sustainable agriculture.
            </p>
          </div>
          <Link to="/user/products">
            <Button className="bg-agri-green hover:bg-agri-green-dark">
              Shop Now
            </Button>
          </Link>
        </div>
      </Card>
      
      {/* Recent Order & Featured Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Order */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Latest Order</h2>
          </div>
          
          <div className="p-6">
            {latestOrder ? (
              <div>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{latestOrder.id}</p>
                    <p className="font-medium">
                      {new Date(latestOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span 
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${latestOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          latestOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          latestOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          latestOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`
                      }
                    >
                      {latestOrder.status.charAt(0).toUpperCase() + latestOrder.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {latestOrder.products.map((product) => (
                    <div key={product.productId} className="flex justify-between text-sm">
                      <span>{product.name} x{product.quantity}</span>
                      <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Total:</span>
                  <span>${latestOrder.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="mt-4">
                  <Link to="/user/orders">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-2">You haven't placed any orders yet.</p>
                <Link to="/user/products">
                  <Button size="sm" className="bg-agri-green hover:bg-agri-green-dark">
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
        
        {/* Featured Categories */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Featured Categories</h2>
          </div>
          
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link to="/user/products?category=Vegetables">
              <div className="relative rounded-lg overflow-hidden h-32 cursor-pointer transition-all hover:opacity-90">
                <img 
                  src="https://images.unsplash.com/photo-1598170845058-32b9d6a5d4f4?q=80&w=1974&auto=format&fit=crop"
                  alt="Vegetables"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">Vegetables</h3>
                </div>
              </div>
            </Link>
            
            <Link to="/user/products?category=Fruits">
              <div className="relative rounded-lg overflow-hidden h-32 cursor-pointer transition-all hover:opacity-90">
                <img 
                  src="https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070&auto=format&fit=crop"
                  alt="Fruits"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">Fruits</h3>
                </div>
              </div>
            </Link>
            
            <Link to="/user/products?category=Dairy">
              <div className="relative rounded-lg overflow-hidden h-32 cursor-pointer transition-all hover:opacity-90">
                <img 
                  src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1974&auto=format&fit=crop"
                  alt="Dairy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">Dairy</h3>
                </div>
              </div>
            </Link>
            
            <Link to="/user/products?category=Poultry">
              <div className="relative rounded-lg overflow-hidden h-32 cursor-pointer transition-all hover:opacity-90">
                <img 
                  src="https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&w=2070&auto=format&fit=crop"
                  alt="Poultry"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg">Poultry</h3>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Seasonal Tips */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Seasonal Farming Tips</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-agri-green-light/30 flex items-center justify-center flex-shrink-0">
              🌱
            </div>
            <div>
              <h3 className="font-medium text-agri-brown-dark">Spring Planting</h3>
              <p className="text-sm text-gray-600">
                Start planting cool-weather crops like lettuce, spinach, and peas. 
                It's also time to prepare beds for summer vegetables.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-agri-yellow/30 flex items-center justify-center flex-shrink-0">
              ☀️
            </div>
            <div>
              <h3 className="font-medium text-agri-brown-dark">Summer Maintenance</h3>
              <p className="text-sm text-gray-600">
                Keep plants well-watered during hot weather and apply mulch to 
                conserve soil moisture and suppress weeds.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-agri-brown-light/20 flex items-center justify-center flex-shrink-0">
              🍂
            </div>
            <div>
              <h3 className="font-medium text-agri-brown-dark">Fall Harvest</h3>
              <p className="text-sm text-gray-600">
                Harvest summer crops and plant fall vegetables like broccoli, 
                carrots, and kale. Prepare garlic for planting.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default UserDashboard;