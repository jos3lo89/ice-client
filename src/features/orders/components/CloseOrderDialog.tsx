// src/features/orders/components/CloseOrderDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import type { OrderListItem } from "@/types/orders.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CloseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderListItem;
}

export default function CloseOrderDialog({
  open,
  onOpenChange,
  order,
}: CloseOrderDialogProps) {
  const { closeOrder } = useOrders();
  const [notes, setNotes] = useState("");

  // const hasPendingItems = order.items_count > 0 && order.subtotal > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    closeOrder.mutate(
      {
        id: order.id,
        values: notes ? { notes } : undefined,
      },
      {
        onSuccess: () => {
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar Orden #{order.daily_number}</DialogTitle>
          <DialogDescription>
            Mesa {order.table_number} - {order.floor_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resumen */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Items:</span>
              <span className="font-medium">{order.items_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Comensales:</span>
              <span className="font-medium">{order.diners_count}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Total:</span>
              <span className="font-bold">S/ {order.subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Validación */}
          {/* {!hasPendingItems ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No se puede cerrar</AlertTitle>
              <AlertDescription>
                La orden debe tener al menos un item para poder cerrarla
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Lista para cerrar</AlertTitle>
              <AlertDescription>
                La orden quedará marcada como "Cerrada" y aparecerá en la
                pantalla del cajero para ser cobrada
              </AlertDescription>
            </Alert>
          )} */}

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Lista para cerrar</AlertTitle>
            <AlertDescription>
              La orden quedará marcada como "Cerrada" y aparecerá en la pantalla
              del cajero para ser cobrada
            </AlertDescription>
          </Alert>

          {/* Notas opcionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas de cierre (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cliente satisfecho, servir postre..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={closeOrder.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={closeOrder.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {closeOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Cerrar Orden
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
