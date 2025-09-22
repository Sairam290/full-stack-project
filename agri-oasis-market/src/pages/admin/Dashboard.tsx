import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/shared/StatCard";
import SimpleBarChart from "@/components/charts/BarChart";
import SimplePieChart from "@/components/charts/PieChart";
import { getAllProducts, getAllOrders, getFarmers, getMonthlySales, getCategorySales, CategorySales, MonthlySales, User, Order, Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [salesData, setSalesData] = useState<MonthlySales[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsData = await getAllProducts();
        setProducts(productsData);

        // Fetch orders
        const ordersData = await getAllOrders();
        setOrders(ordersData);

        // Fetch farmers
        const farmersData = await getFarmers();
        setFarmers(farmersData);

        // Aggregate monthly sales and category sales across all farmers
        const monthlySalesPromises = farmersData.map(farmer => getMonthlySales(farmer.id));
        const categorySalesPromises = farmersData.map(farmer => getCategorySales(farmer.id));

        const monthlySalesResults = await Promise.all(monthlySalesPromises);
        const categorySalesResults = await Promise.all(categorySalesPromises);

        // Aggregate monthly sales
        const aggregatedSales: { [month: string]: number } = {};
        monthlySalesResults.flat().forEach(sale => {
          if (aggregatedSales[sale.month]) {
            aggregatedSales[sale.month] += sale.sales;
          } else {
            aggregatedSales[sale.month] = sale.sales;
          }
        });

        const aggregatedSalesData = Object.keys(aggregatedSales).map(month => ({
          month,
          sales: aggregatedSales[month],
        }));
        setSalesData(aggregatedSalesData);

        // Aggregate category sales
        const aggregatedCategories: { [name: string]: number } = {};
        categorySalesResults.flat().forEach(category => {
          if (aggregatedCategories[category.name]) {
            aggregatedCategories[category.name] += category.value;
          } else {
            aggregatedCategories[category.name] = category.value;
          }
        });

        const aggregatedCategoryData = Object.keys(aggregatedCategories).map(name => ({
          name,
          value: aggregatedCategories[name],
        }));
        setCategoryData(aggregatedCategoryData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) return <div>Loading...</div>;

  // Calculate statistics
  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalProducts = products.length;
  const totalFarmers = farmers.length;
  const totalUsers = [...new Set(orders.map(order => order.userId))].length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;

  return (
    <Layout title="Admin Dashboard" role="admin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon="💰"
          trend="up"
          trendValue="15% from last month"
        />
        
        <StatCard 
          title="Total Products"
          value={totalProducts}
          icon="🥕"
          description="Listed on the platform"
        />
        
        <StatCard 
          title="Total Farmers"
          value={totalFarmers}
          icon="👨‍🌾"
          trend="up"
          trendValue="2 new this month"
        />
        
        <StatCard 
          title="Total Users"
          value={totalUsers}
          icon="👥"
          trend="up"
          trendValue="5 new this month"
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
            title="Sales by Product Category"
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
                  Farmer
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.farmerId}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;