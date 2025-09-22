
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import OrderCard from "@/components/shared/OrderCard";
import api, { getOrdersByFarmer, Order } from "@/lib/api"; // Use default import for api
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FarmerOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role !== "farmer") {
        toast({
          title: "Error",
          description: "You must be logged in as a farmer to view orders.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const farmerOrders = await getOrdersByFarmer(user.id);
        setOrders(farmerOrders);
        setFilteredOrders(farmerOrders);
      } catch (error: any) {
        console.error("Fetch orders error:", error.response?.data || error.message);
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      // Update order status using api instance
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });

      // Update local state
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // Update filtered orders
      if (filterStatus === "all") {
        setFilteredOrders(updatedOrders);
      } else {
        setFilteredOrders(updatedOrders.filter((order) => order.status === filterStatus));
      }

      toast({
        title: "Order status updated",
        description: `Order #${orderId} has been marked as ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Update status error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: `Failed to update order status: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);

    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Layout title="Manage Orders" role="farmer">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Track and manage your customer orders</p>
        </div>
        <div className="w-48">
          <Select
            value={filterStatus}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filterStatus === "all"
              ? "You don't have any orders yet."
              : `You don't have any ${filterStatus} orders.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isFarmer={true}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default FarmerOrders;
