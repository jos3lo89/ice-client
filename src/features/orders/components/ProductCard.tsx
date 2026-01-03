import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/products.types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardContent className="p-3">
        <div className="space-y-1 text-center">
          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>

          {product.short_name && (
            <p className="text-xs text-muted-foreground">
              {product.short_name}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              S/ {product.price.toFixed(2)}
            </p>

            {product.has_variants && (
              <Badge variant="secondary" className="text-xs">
                Variantes
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
