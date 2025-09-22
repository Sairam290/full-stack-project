
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/shared/ProductCard";
import api, { getAllProducts, Product } from "@/lib/api"; // Fixed import
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FarmerProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State for product form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState("");

  // Product categories
  const categories = ["Vegetables", "Fruits", "Dairy", "Poultry", "Meat", "Grains", "Other"];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || user.role !== "farmer") {
        toast({
          title: "Error",
          description: "You must be logged in as a farmer to view products.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const allProducts = await getAllProducts();
        const farmerProducts = allProducts.filter(product => product.farmerId === user.id);
        setProducts(farmerProducts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, toast]);

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductQuantity("");
    setProductImage("");
    setCurrentProduct(null);
    setIsEditing(false);
  };

  const handleAddProduct = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductQuantity(product.quantity.toString());
    setProductImage(product.image);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      const updatedProducts = products.filter((p) => p.id !== productId);
      setProducts(updatedProducts);

      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Delete product error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!productName || !productDescription || !productPrice || !productCategory || !productQuantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(productPrice);
    const quantity = parseInt(productQuantity);

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    // Default image if none provided
    const imageUrl = productImage || "/assets/images/default-product.jpg";

    try {
      if (isEditing && currentProduct) {
        // Update existing product
        const updatedProduct = {
          name: productName,
          description: productDescription,
          price,
          category: productCategory,
          quantity,
          image: imageUrl,
          farmerId: user?.id || "",
          farmerName: user?.name || "",
          rating: currentProduct.rating,
          createdAt: currentProduct.createdAt,
        };

        const response = await api.put(`/products/${currentProduct.id}`, updatedProduct);
        const updatedProducts = products.map((p) =>
          p.id === currentProduct.id ? response.data : p
        );

        setProducts(updatedProducts);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        // Add new product
        const newProduct = {
          name: productName,
          description: productDescription,
          price,
          category: productCategory,
          quantity,
          image: imageUrl,
          farmerId: user?.id || "",
          farmerName: user?.name || "",
          rating: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };

        const response = await api.post(`/products`, newProduct);
        setProducts([...products, response.data]);
        toast({
          title: "Product added",
          description: "The new product has been added successfully.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Save product error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} product: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Layout title="My Products" role="farmer">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-agri-green hover:bg-agri-green-dark"
        >
          Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
          <Button
            onClick={handleAddProduct}
            className="bg-agri-green hover:bg-agri-green-dark"
          >
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your product details below"
                : "Fill in the details to add a new product to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name*</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Organic Carrots"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description*</Label>
              <Textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productPrice">Price ($)*</Label>
                <Input
                  id="productPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productQuantity">Quantity*</Label>
                <Input
                  id="productQuantity"
                  type="number"
                  min="1"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategory">Category*</Label>
              <Select
                value={productCategory}
                onValueChange={setProductCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productImage">Image URL</Label>
              <Input
                id="productImage"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500">
                Leave blank for a default image
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-agri-green hover:bg-agri-green-dark"
              onClick={handleSaveProduct}
            >
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default FarmerProducts;
