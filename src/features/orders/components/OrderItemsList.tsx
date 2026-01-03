import OrderItemCard from "./OrderItemCard";
import type { OrderItem } from "@/types/orders.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OrderItemsListProps {
  items: OrderItem[];
  onDeleteItem?: (itemId: string) => void;
  onCancelItem?: (itemId: string) => void;
  canDelete?: boolean;
  canCancel?: boolean;
}

export default function OrderItemsList({
  items,
  onDeleteItem,
  onCancelItem,
  canDelete = false,
  canCancel = false,
}: OrderItemsListProps) {
  const activeItems = items.filter((item) => !item.is_cancelled);
  const cancelledItems = items.filter((item) => item.is_cancelled);

  if (items.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay items en esta orden. Agrega productos para comenzar.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {activeItems.length > 0 && (
        <div className="space-y-2">
          {activeItems.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
              onCancel={onCancelItem}
              canDelete={canDelete}
              canCancel={canCancel}
            />
          ))}
        </div>
      )}

      {cancelledItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Cancelados ({cancelledItems.length})
          </h3>
          <div className="space-y-2">
            {cancelledItems.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
