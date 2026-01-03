// src/features/orders/components/OrderSummarySheet.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import OrderItemsList from "./OrderItemsList";
import OrderActions from "./OrderActions";
import type { Order } from "@/types/orders.types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderSummarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onDeleteItem?: (itemId: string) => void;
  onCancelItem?: (itemId: string) => void;
  onSendToKitchen: () => void;
  onCloseOrder: (notes?: string) => void;
  onCancelOrder: (reason: string) => void;
  isSending?: boolean;
  isClosing?: boolean;
  isCancelling?: boolean;
}

const OrderSummarySheet = ({
  open,
  onOpenChange,
  order,
  onDeleteItem,
  onCancelItem,
  onSendToKitchen,
  onCloseOrder,
  onCancelOrder,
  isSending,
  isClosing,
  isCancelling,
}: OrderSummarySheetProps) => {
  const activeItemsCount = order.order_items.filter(
    (item) => !item.is_cancelled,
  ).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {activeItemsCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {activeItemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Orden #{order.daily_number}</SheetTitle>
          <SheetDescription>
            Mesa {order.table.number} - {order.table.floor_name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex px-3 flex-col gap-2 h-[calc(100vh-120px)]">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Items ({activeItemsCount})</h3>
            </div>
            <ScrollArea className="h-full pr-4 pb-4">
              <OrderItemsList
                items={order.order_items}
                onDeleteItem={onDeleteItem}
                onCancelItem={onCancelItem}
                canDelete={true}
                canCancel={true}
              />
            </ScrollArea>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  S/ {order.subtotal.toFixed(2)}
                </span>
              </div>

              {order.total_cancelled > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Cancelado:</span>
                  <span>-S/ {order.total_cancelled.toFixed(2)}</span>
                </div>
              )}

              {order.total_paid > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Pagado:</span>
                  <span>-S/ {order.total_paid.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Pendiente:</span>
              <span>S/ {order.total_pending.toFixed(2)}</span>
            </div>

            {order.is_split_payment && (
              <div className="rounded-md bg-muted p-2 text-center text-xs">
                Pago dividido ({order.split_payment_count} pagos)
              </div>
            )}
          </div>

          <Separator />

          <OrderActions
            order={order}
            onSendToKitchen={onSendToKitchen}
            onCloseOrder={onCloseOrder}
            onCancelOrder={onCancelOrder}
            isSending={isSending}
            isClosing={isClosing}
            isCancelling={isCancelling}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSummarySheet;
