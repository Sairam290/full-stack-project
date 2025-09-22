
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/shared/StatCard";
import SimpleBarChart from "@/components/charts/BarChart";
import SimplePieChart from "@/components/charts/PieChart";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getOrdersByFarmer, getAllProducts, getMonthlySales, getCategorySales, MonthlySales, Product, Order, CategorySales } from "@/lib/api";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesData, setSalesData] = useState<MonthlySales[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data
  const fallbackMonthlySales = [
    { month: "Jan", sales: 0 },
    { month: "Feb", sales: 0 },
    { month: "Mar", sales: 0 },
    { month: "Apr", sales: 0 },
    { month: "May", sales: 0 },
    { month: "Jun", sales: 0 },
    { month: "Jul", sales: 0 },
    { month: "Aug", sales: 0 },
    { month: "Sep", sales: 0 },
    { month: "Oct", sales: 0 },
    { month: "Nov", sales: 0 },
    { month: "Dec", sales: 0 },
  ];

  const fallbackCategorySales = [
    { name: "No Data", value: 100 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in to view the dashboard.");
        toast({
          title: "Error",
          description: "You must be logged in to view the dashboard.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        // Allow admins to view dashboard
        if (user.role !== "farmer" && user.role !== "admin") {
          setError("You must be a farmer or admin to view the dashboard.");
          toast({
            title: "Error",
            description: "You must be a farmer or admin to view the dashboard.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Fetch orders for the farmer
        const farmerOrders = await getOrdersByFarmer(user.id);
        setOrders(farmerOrders);

        // Fetch products for the farmer
        const allProducts = await getAllProducts();
        const farmerProducts = allProducts.filter(product => product.farmerId === user.id);
        setProducts(farmerProducts);

        // Fetch sales data
        const monthlySales = await getMonthlySales(user.id);
        setSalesData(monthlySales.length > 0 ? monthlySales : fallbackMonthlySales);

        // Fetch product sales data
        const categorySales = await getCategorySales(user.id);
        setCategoryData(categorySales.length > 0 ? categorySales : fallbackCategorySales);
      } catch (error: any) {
        console.error("Fetch dashboard error:", error);
        const errorMessage = error.response?.status === 403
          ? "Access denied: You do not have permission to view dashboard data."
          : "Failed to fetch dashboard data. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setSalesData(fallbackMonthlySales);
        setCategoryData(fallbackCategorySales);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Calculate statistics
  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const totalCustomers = [...new Set(orders.map(order => order.userId))].length;

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Layout title="Farmer Dashboard" role={user?.role as "farmer" | "admin"}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon="💰"
          trend="up"
          trendValue="12% from last month"
        />
        
        <StatCard 
          title="Total Products"
          value={totalProducts}
          icon="🥕"
          description="Active products in your store"
        />
        
        <StatCard 
          title="Pending Orders"
          value={pendingOrders}
          icon="📦"
          trend={pendingOrders > 0 ? "up" : "neutral"}
          trendValue={pendingOrders > 0 ? `${pendingOrders} need attention` : "No pending orders"}
        />
        
        <StatCard 
          title="Total Customers"
          value={totalCustomers}
          icon="👥"
          trend="up"
          trendValue="3 new this month"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <SimpleBarChart 
            data={salesData}
            xKey="month"
            yKey="sales"
            title="Monthly Sales (2023)"
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <SimplePieChart 
            data={categoryData}
            nameKey="name"
            dataKey="value"
            title="Sales by Product"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerDashboard;
