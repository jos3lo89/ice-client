// src/features/orders/components/OrderItemCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderItemStatus } from "@/types/orders.types";
import type { OrderItem, VariantSelection } from "@/types/orders.types";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface OrderItemCardProps {
  item: OrderItem;
  onDelete?: (itemId: string) => void;
  onCancel?: (itemId: string) => void;
  canDelete?: boolean;
  canCancel?: boolean;
}

const getStatusConfig = (status: OrderItemStatus) => {
  const config = {
    [OrderItemStatus.PENDIENTE]: {
      variant: "secondary" as const,
      className: "bg-gray-500 text-white",
      label: "Pendiente",
    },
    [OrderItemStatus.ENVIADO]: {
      variant: "default" as const,
      className: "bg-blue-500 text-white",
      label: "Enviado",
    },
    [OrderItemStatus.EN_PREPARACION]: {
      variant: "default" as const,
      className: "bg-yellow-500 text-white",
      label: "Preparando",
    },
    [OrderItemStatus.LISTO]: {
      variant: "default" as const,
      className: "bg-green-500 text-white",
      label: "Listo",
    },
    [OrderItemStatus.ENTREGADO]: {
      variant: "default" as const,
      className: "bg-green-700 text-white",
      label: "Entregado",
    },
  };

  return config[status] || config[OrderItemStatus.PENDIENTE];
};

export default function OrderItemCard({
  item,
  onDelete,
  onCancel,
  canDelete = false,
  canCancel = false,
}: OrderItemCardProps) {
  const statusConfig = getStatusConfig(item.status);

  console.log(item);

  const variants: VariantSelection[] = useMemo(() => {
    if (!item.variants_snapshot) return [];
    try {
      return typeof item.variants_snapshot === "string"
        ? JSON.parse(item.variants_snapshot)
        : item.variants_snapshot;
    } catch (e) {
      return [];
    }
  }, [item.variants_snapshot]);

  return (
    <Card className={cn(item.is_cancelled && "opacity-50")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Info del item */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">
                  {item.quantity}x {item.product_name}
                </h4>
                {item.product_short_name && (
                  <p className="text-xs text-muted-foreground">
                    {item.product_short_name}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold">S/ {item.line_total.toFixed(2)}</p>
                {item.variants_total > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +S/ {item.variants_total.toFixed(2)} variantes
                  </p>
                )}
              </div>
            </div>

            {/* Variantes */}
            {variants && variants.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {variants.map((variant, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {variant.option_name}
                    {variant.price_modifier > 0 &&
                      ` (+S/ ${variant.price_modifier.toFixed(2)})`}
                  </Badge>
                ))}
              </div>
            )}

            {/* <pre>{item.variants_snapshot}</pre> */}

            {/* Notas */}
            {item.notes && (
              <p className="text-sm italic text-muted-foreground">
                📝 {item.notes}
              </p>
            )}

            {/* Estado y badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={statusConfig.variant}
                className={statusConfig.className}
              >
                {statusConfig.label}
              </Badge>

              {item.is_cancelled && (
                <Badge variant="destructive">Cancelado</Badge>
              )}

              {item.is_paid && (
                <Badge variant="default" className="bg-green-600">
                  Pagado
                </Badge>
              )}
            </div>
          </div>

          {/* Acciones */}
          {(canDelete || canCancel) && !item.is_cancelled && !item.is_paid && (
            <div className="flex flex-col gap-2">
              {canDelete && item.status === OrderItemStatus.PENDIENTE && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(item.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              {canCancel && item.status !== OrderItemStatus.PENDIENTE && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancel?.(item.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
