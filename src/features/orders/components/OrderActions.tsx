// src/features/orders/components/OrderActions.tsx
import { Button } from "@/components/ui/button";
import { OrderStatus, OrderItemStatus } from "@/types/orders.types";
import type { Order } from "@/types/orders.types";
import { Send, DollarSign, X, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OrderActionsProps {
  order: Order;
  onSendToKitchen: () => void;
  onCloseOrder: (notes?: string) => void;
  onCancelOrder: (reason: string) => void;
  isSending?: boolean;
  isClosing?: boolean;
  isCancelling?: boolean;
}

export default function OrderActions({
  order,
  onSendToKitchen,
  onCloseOrder,
  onCancelOrder,
  isSending = false,
  isClosing = false,
  isCancelling = false,
}: OrderActionsProps) {
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [closeNotes, setCloseNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const pendingItems = order.order_items.filter(
    (item) => item.status === OrderItemStatus.PENDIENTE && !item.is_cancelled
  );

  const allItemsDelivered = order.order_items
    .filter((item) => !item.is_cancelled)
    .every((item) => item.status === OrderItemStatus.ENTREGADO);

  const canSendToKitchen =
    pendingItems.length > 0 && order.status === OrderStatus.ABIERTA;
  const canClose =
    order.status === OrderStatus.ABIERTA &&
    allItemsDelivered &&
    order.order_items.length > 0;
  const canCancel =
    order.status !== OrderStatus.CANCELADA &&
    order.status !== OrderStatus.PAGADA;

  const handleClose = () => {
    onCloseOrder(closeNotes || undefined);
    setShowCloseDialog(false);
    setCloseNotes("");
  };

  const handleCancel = () => {
    if (cancelReason.trim()) {
      onCancelOrder(cancelReason);
      setShowCancelDialog(false);
      setCancelReason("");
    }
  };

  return (
    <>
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

        {canClose && (
          <Button
            onClick={() => setShowCloseDialog(true)}
            disabled={isClosing}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isClosing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Cerrar y Cobrar
              </>
            )}
          </Button>
        )}

        {canCancel && (
          <Button
            onClick={() => setShowCancelDialog(true)}
            disabled={isCancelling}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancelar Orden
              </>
            )}
          </Button>
        )}
      </div>

      {/* Dialog: Cerrar Orden */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cerrar Orden</AlertDialogTitle>
            <AlertDialogDescription>
              La orden será marcada como cerrada y lista para cobrar.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="close-notes">Notas de cierre (opcional)</Label>
            <Textarea
              id="close-notes"
              placeholder="Agregar observaciones..."
              value={closeNotes}
              onChange={(e) => setCloseNotes(e.target.value)}
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>
              Cerrar Orden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Cancelar Orden */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Orden</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará todos los items de la orden.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">
              Motivo de cancelación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Ingresa el motivo..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={!cancelReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Cancelación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
