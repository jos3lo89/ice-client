// src/features/orders/components/AddItemDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Loader2 } from "lucide-react";
import type { Product, VariantGroup } from "@/types/products.types";
import type { VariantSelection } from "@/types/orders.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onAdd: (
    productId: string,
    quantity: number,
    variants?: string,
    // variants?: VariantSelection[],
    notes?: string,
  ) => void;
  isAdding?: boolean;
}

export default function AddItemDialog({
  open,
  onOpenChange,
  product,
  onAdd,
  isAdding = false,
}: AddItemDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, VariantSelection>
  >({});

  if (!product) return null;

  const handleVariantChange = (
    group: VariantGroup,
    optionName: string,
    priceModifier: number,
  ) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [group.id]: {
        group_name: group.name,
        option_name: optionName,
        price_modifier: priceModifier,
      },
    }));
  };

  const handleMultipleVariantChange = (
    group: VariantGroup,
    optionName: string,
    priceModifier: number,
    checked: boolean,
  ) => {
    setSelectedVariants((prev) => {
      const key = `${group.id}-${optionName}`;
      const newVariants = { ...prev };

      if (checked) {
        newVariants[key] = {
          group_name: group.name,
          option_name: optionName,
          price_modifier: priceModifier,
        };
      } else {
        delete newVariants[key];
      }

      return newVariants;
    });
  };

  const variantsArray = Object.values(selectedVariants);
  const variantsTotal = variantsArray.reduce(
    (sum, v) => sum + v.price_modifier,
    0,
  );
  const unitPrice = product.price + variantsTotal;
  const total = unitPrice * quantity;

  const canAdd = () => {
    // Verificar que todos los grupos requeridos tengan selección
    const requiredGroups = product.variant_groups.filter((g) => g.is_required);

    for (const group of requiredGroups) {
      const hasSelection = Object.values(selectedVariants).some(
        (v) => v.group_name === group.name,
      );
      if (!hasSelection) return false;
    }

    return quantity > 0;
  };

  const handleAdd = () => {
    if (!canAdd()) return;

    onAdd(
      product.id,
      quantity,
      variantsArray.length > 0 ? JSON.stringify(variantsArray) : undefined,
      notes || undefined,
    );

    // Reset
    setQuantity(1);
    setNotes("");
    setSelectedVariants({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setQuantity(1);
    setNotes("");
    setSelectedVariants({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.description || "Personaliza tu pedido"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Variantes */}
            {product.variant_groups.map((group) => (
              <div key={group.id} className="space-y-3">
                <Label className="text-base">
                  {group.name}
                  {group.is_required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </Label>

                {/* Radio Group - max_selections = 1 */}
                {group.max_selections === 1 ? (
                  <RadioGroup
                    onValueChange={(value) => {
                      const option = group.options.find((o) => o.id === value);
                      if (option) {
                        handleVariantChange(
                          group,
                          option.name,
                          option.price_modifier,
                        );
                      }
                    }}
                  >
                    {group.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between space-x-2 rounded-md border p-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="cursor-pointer font-normal"
                          >
                            {option.name}
                          </Label>
                        </div>
                        {option.price_modifier > 0 && (
                          <span className="text-sm text-muted-foreground">
                            +S/ {option.price_modifier.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  /* Checkboxes - max_selections > 1 */
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Máximo {group.max_selections} selecciones
                    </p>
                    {group.options.map((option) => {
                      const key = `${group.id}-${option.name}`;
                      const isChecked = !!selectedVariants[key];
                      const selectedCount = Object.keys(
                        selectedVariants,
                      ).filter((k) => k.startsWith(group.id)).length;
                      const canSelect =
                        selectedCount < group.max_selections || isChecked;

                      return (
                        <div
                          key={option.id}
                          className="flex items-center justify-between space-x-2 rounded-md border p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleMultipleVariantChange(
                                  group,
                                  option.name,
                                  option.price_modifier,
                                  checked as boolean,
                                )
                              }
                              disabled={!canSelect}
                            />
                            <Label
                              htmlFor={option.id}
                              className="cursor-pointer font-normal"
                            >
                              {option.name}
                            </Label>
                          </div>
                          {option.price_modifier > 0 && (
                            <span className="text-sm text-muted-foreground">
                              +S/ {option.price_modifier.toFixed(2)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Cantidad */}
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(val);
                    }
                  }}
                  className="w-20 text-center"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas especiales (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ej: Sin cebolla, bien cocido..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Resumen y Acción */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">S/ {total.toFixed(2)}</p>
            {variantsTotal > 0 && (
              <p className="text-xs text-muted-foreground">
                Incluye S/ {variantsTotal.toFixed(2)} en extras
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isAdding}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!canAdd() || isAdding}>
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
