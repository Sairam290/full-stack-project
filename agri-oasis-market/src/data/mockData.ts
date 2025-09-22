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