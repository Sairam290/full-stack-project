
import { Order } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderCardProps {
  order: Order;
  isFarmer?: boolean;
  onUpdateStatus?: (orderId: string, status: Order["status"]) => void;
}

const OrderCard = ({ order, isFarmer, onUpdateStatus }: OrderCardProps) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Date: {formatDate(order.createdAt)}</span>
          <span>Total: ${order.totalAmount.toFixed(2)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2">Products:</h4>
        <ul className="space-y-2">
          {order.products.map((product) => (
            <li key={product.productId} className="flex justify-between text-sm border-b pb-2">
              <div>
                {product.name} <span className="text-gray-500">x{product.quantity}</span>
              </div>
              <div className="font-medium">${(product.price * product.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 pt-2 border-t">
          {isFarmer ? (
            <div className="text-sm">
              <p><span className="font-medium">Customer:</span> {order.userName}</p>
              <p><span className="font-medium">Contact:</span> {order.userContact}</p>
              <p><span className="font-medium">Shipping Address:</span> {order.shippingAddress}</p>
            </div>
          ) : (
            <div className="text-sm">
              <p><span className="font-medium">Farmer ID:</span> {order.farmerId}</p>
              <p><span className="font-medium">Shipping Address:</span> {order.shippingAddress}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {isFarmer && onUpdateStatus && order.status !== "delivered" && order.status !== "cancelled" && (
        <CardFooter className="flex gap-2 justify-end bg-gray-50">
          {order.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-agri-green text-agri-green hover:bg-agri-green/10"
                onClick={() => onUpdateStatus(order.id, "confirmed")}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => onUpdateStatus(order.id, "cancelled")}
              >
                Cancel
              </Button>
            </>
          )}
          
          {order.status === "confirmed" && (
            <Button
              size="sm"
              variant="outline"
              className="border-agri-green text-agri-green hover:bg-agri-green/10"
              onClick={() => onUpdateStatus(order.id, "shipped")}
            >
              Mark as Shipped
            </Button>
          )}
          
          {order.status === "shipped" && (
            <Button
              size="sm"
              variant="outline"
              className="border-agri-green text-agri-green hover:bg-agri-green/10"
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              Mark as Delivered
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCard;
