
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SimpleBarChart from "@/components/charts/BarChart";
import SimplePieChart from "@/components/charts/PieChart";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getMonthlySales, getCategorySales, CategorySales, MonthlySales } from "@/lib/api";

const FarmerAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback data
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

  const weeklyData = [
    { day: 'Mon', sales: 12 },
    { day: 'Tue', sales: 19 },
    { day: 'Wed', sales: 15 },
    { day: 'Thu', sales: 22 },
    { day: 'Fri', sales: 30 },
    { day: 'Sat', sales: 45 },
    { day: 'Sun', sales: 25 },
  ];

  const customerData = [
    { name: 'New', value: 35 },
    { name: 'Returning', value: 65 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in to view analytics.");
        toast({
          title: "Error",
          description: "You must be logged in to view analytics.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        // Allow admins to view analytics
        if (user.role !== "farmer" && user.role !== "admin") {
          setError("You must be a farmer or admin to view analytics.");
          toast({
            title: "Error",
            description: "You must be a farmer or admin to view analytics.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Fetch monthly sales
        const sales = await getMonthlySales(user.id);
        setMonthlySales(sales.length > 0 ? sales : fallbackMonthlySales);

        // Fetch product sales
        const categories = await getCategorySales(user.id);
        setCategorySales(categories.length > 0 ? categories : fallbackCategorySales);
      } catch (error: any) {
        console.error("Fetch analytics error:", error);
        const errorMessage = error.response?.status === 403
          ? "Access denied: You do not have permission to view analytics."
          : "Failed to fetch analytics data. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setMonthlySales(fallbackMonthlySales);
        setCategorySales(fallbackCategorySales);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Layout title="Analytics & Insights" role={user?.role as "farmer" | "admin"}>
      <div className="mb-6">
        <p className="text-gray-600">Track your sales performance and customer insights</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <SimpleBarChart 
            data={monthlySales}
            xKey="month"
            yKey="sales"
            title="Monthly Sales (2023)"
          />
        </Card>
        
        <Card className="p-6">
          <SimplePieChart 
            data={categorySales}
            nameKey="name"
            dataKey="value"
            title="Sales by Product"
          />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SimpleBarChart 
            data={weeklyData}
            xKey="day"
            yKey="sales"
            title="Weekly Sales Performance"
            color="#FBBF24"
          />
        </Card>
        
        <Card className="p-6">
          <SimplePieChart 
            data={customerData}
            nameKey="name"
            dataKey="value"
            title="Customer Types"
            colors={["#65A30D", "#84CC16"]}
          />
        </Card>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-l-4 border-agri-green rounded-md">
            <h3 className="font-medium text-agri-green-dark">Top Performing Products</h3>
            <p className="mt-1 text-sm text-gray-600">
              Your "Organic Carrots" and "Fresh Apples" are your best selling products. 
              Consider increasing inventory or offering bundle deals with these items.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
            <h3 className="font-medium text-yellow-800">Seasonal Trend</h3>
            <p className="mt-1 text-sm text-gray-600">
              Sales typically increase during summer months. Consider preparing special 
              summer promotions and increasing inventory for your seasonal products.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
            <h3 className="font-medium text-blue-800">Customer Retention</h3>
            <p className="mt-1 text-sm text-gray-600">
              65% of your sales come from returning customers. Consider a loyalty 
              program to encourage continued purchases.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerAnalytics;
