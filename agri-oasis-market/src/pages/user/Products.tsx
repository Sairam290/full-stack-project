import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shared/ProductCard";
import { getAllProducts, Product } from "@/lib/api";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UserProducts = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popularity");
  const [loading, setLoading] = useState(true);

  // Shopping cart
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  // Categories
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated || !user || user.role !== "user") {
        toast({
          title: "Error",
          description: "You must be logged in as a user to view products.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, isAuthenticated, toast]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popularity":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Update URL when category changes
  useEffect(() => {
    if (categoryFilter === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryFilter });
    }
  }, [categoryFilter, setSearchParams]);

  const handleAddToCart = (product: Product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Product already in cart, increment quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a shipping address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const order = {
        userId: user?.id || "",
        userName: user?.name || "",
        userContact: user?.email || "",
        shippingAddress,
        products: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        status: "pending",
        farmerId: cart[0]?.farmerId || "",
        createdAt: new Date().toISOString(),
      };

      await api.post("/orders", order);
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully!",
      });

      setCart([]);
      setShippingAddress("");
      setShowCart(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to place order.",
        variant: "destructive",
      });
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) return <div>Loading...</div>;

  return (
    <Layout title="Shop Products" role="user">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setShowCart(true)}
              className="bg-agri-green hover:bg-agri-green-dark"
            >
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {searchTerm && (
            <div className="flex items-center bg-gray-100 text-sm rounded-full px-3 py-1">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {categoryFilter !== "all" && (
            <div className="flex items-center bg-gray-100 text-sm rounded-full px-3 py-1">
              Category: {categoryFilter}
              <button
                onClick={() => setCategoryFilter("all")}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showFarmer={true}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Shopping Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Your Shopping Cart</DialogTitle>
            <DialogDescription>
              {cart.length === 0
                ? "Your cart is empty."
                : `You have ${cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )} items in your cart.`}
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500">
                Your cart is empty. Add some products to get started!
              </p>
              <Button
                className="mt-4 bg-agri-green hover:bg-agri-green-dark"
                onClick={() => setShowCart(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 ml-2 text-red-500"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input
                    id="shippingAddress"
                    placeholder="Enter your shipping address"
                    className="mt-1"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                  <Button variant="outline" onClick={() => setShowCart(false)}>
                    Continue Shopping
                  </Button>
                  <Button
                    className="bg-agri-green hover:bg-agri-green-dark"
                    onClick={handleCheckout}
                  >
                    Checkout (${cartTotal.toFixed(2)})
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserProducts;