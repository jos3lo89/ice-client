import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Grid3x3 } from "lucide-react";
import type { ListCategoriesData } from "@/types/categories.types";

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  categories: ListCategoriesData[];
}

export default function CategorySheet({
  open,
  onOpenChange,
  selectedCategoryId,
  onSelectCategory,
  categories,
}: CategorySheetProps) {
  const categoriesFilter = categories.filter((cat) => cat.is_active) || [];

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Grid3x3 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedCategory ? (
              <span>{`${selectedCategory.name} (${selectedCategory._count.products})`}</span>
            ) : (
              <span>Categorías ({categoriesFilter.length})</span>
            )}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="p-4">
        <SheetHeader>
          <SheetTitle>Seleccionar Categoría</SheetTitle>
          <SheetDescription>
            Selecciona una categoría para agregar productos a la orden.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-3 lg:grid-cols-4">
          {categoriesFilter.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategoryId === category.id ? "secondary" : "outline"
              }
              className="flex-col h-16 gap-2 relative"
              onClick={() => {
                onSelectCategory(category.id);
                onOpenChange(false);
              }}
            >
              {selectedCategoryId === category.id && (
                <Check className="absolute right-2 top-2 h-4 w-4" />
              )}

              <div className="text-center">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  {category._count.products} productos
                </p>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
