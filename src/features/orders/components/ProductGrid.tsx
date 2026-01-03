import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Product } from "@/types/products.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onSelectProduct,
}: ProductGridProps) {
  const filteredProducts = products.filter(
    (p) => p.is_active && p.is_available,
  );

  if (filteredProducts.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay productos disponibles en esta categoría
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </div>
  );
}
