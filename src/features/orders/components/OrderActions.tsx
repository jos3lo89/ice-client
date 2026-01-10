import { Button } from "@/components/ui/button";
import { OrderStatus, OrderItemStatus } from "@/types/orders.types";
import type { Order } from "@/types/orders.types";
import { Send, Loader2 } from "lucide-react";

interface OrderActionsProps {
  order: Order;
  onSendToKitchen: () => void;
  isSending?: boolean;
}

export default function OrderActions({
  order,
  onSendToKitchen,
  isSending = false,
}: OrderActionsProps) {
  const pendingItems = order.order_items.filter(
    (item) => item.status === OrderItemStatus.PENDIENTE && !item.is_cancelled
  );

  const canSendToKitchen =
    pendingItems.length > 0 && order.status === OrderStatus.ABIERTA;

  return (
    <div className="flex flex-col gap-3">
      {canSendToKitchen && (
        <Button
          onClick={onSendToKitchen}
          disabled={isSending}
          className="w-full"
          size="lg"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar a Pedido ({pendingItems.length})
            </>
          )}
        </Button>
      )}
    </div>
  );
}
