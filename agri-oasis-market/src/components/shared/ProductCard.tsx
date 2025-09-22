
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  showFarmer?: boolean;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductCard = ({
  product,
  showFarmer = false,
  onAddToCart,
  onEdit,
  onDelete
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Category badge */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-agri-green-dark">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="font-bold text-agri-green-dark">${product.price.toFixed(2)}</span>
        </div>
        
        {showFarmer && (
          <p className="text-sm text-gray-600 mb-2">
            Farmer: {product.farmerName}
          </p>
        )}
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Star rating */}
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm">{product.rating}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Stock: {product.quantity}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className={`mt-4 flex gap-2 ${onEdit && onDelete ? 'justify-between' : 'justify-center'}`}>
          {onAddToCart && (
            <Button 
              size="sm" 
              className="w-full bg-agri-green hover:bg-agri-green-dark btn-hover"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </Button>
          )}
          
          {onEdit && onDelete && (
            <>
              <Button 
                size="sm"
                variant="outline"
                className="border-agri-green text-agri-green hover:bg-agri-green/10"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
