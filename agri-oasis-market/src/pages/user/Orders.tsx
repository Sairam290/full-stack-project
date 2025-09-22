import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import OrderCard from "@/components/shared/OrderCard";
import { getOrdersByUser, Order } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || user.role !== "user") {
        toast({
          title: "Error",
          description: "You must be logged in as a user to view orders.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const userOrders = await getOrdersByUser(user.id);
        setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
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
    <Layout title="My Orders" role="user">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Track and manage your orders</p>
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
              ? "You haven't placed any orders yet."
              : `You don't have any ${filterStatus} orders.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default UserOrders;