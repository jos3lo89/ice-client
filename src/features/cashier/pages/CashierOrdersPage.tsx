import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  DollarSign,
  Users,
  AlertCircle,
  Clock,
  Percent,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OrderStatus } from "@/types/orders.types";
import ProcessPaymentDialog from "@/features/payments/components/ProcessPaymentDialog";
import SplitPaymentDialog from "@/features/payments/components/SplitPaymentDialog";
import type { OrderListItem } from "@/types/orders.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useOrders } from "@/hooks/useOrders";
import { useCashRegisters } from "@/hooks/useCashRegisters";
import IncrementalPaymentDialog from "@/features/payments/components/IncrementalPaymentDialog";
import { Link } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CashierOrdersPage() {
  const { listActiveOrdersQuery, cancelOrder } = useOrders();

  // const { floorsWithTablesQry } = useFloors();
  const { currentCashRegisterQuery } = useCashRegisters();
  const [showIncrementalDialog, setShowIncrementalDialog] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
    null
  );
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSplitPaymentDialog, setShowSplitPaymentDialog] = useState(false);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const cashRegister = currentCashRegisterQuery.data?.data;
  const isOpen = !!cashRegister;

  if (!isOpen) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Cobrar Órdenes</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Caja Cerrada</AlertTitle>
          <AlertDescription>
            Debes abrir una caja para poder procesar pagos.{" "}
            <Link to="/cashier/cash-register" className="underline font-medium">
              Ir a Caja
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (listActiveOrdersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filtrar solo órdenes CERRADAS (listas para pagar)
  const closedOrders = (listActiveOrdersQuery.data?.data || [])
    .filter(
      (order) =>
        order.status === OrderStatus.CERRADA ||
        order.status === OrderStatus.PARCIALMENTE_PAGADA ||
        order.status === OrderStatus.EN_PAGO_DIVIDIDO
    )
    .filter((order) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        order.daily_number.toString().includes(term) ||
        order.table_number.toString().includes(term) ||
        order.user_name.toLowerCase().includes(term)
      );
    });

  const handleOpenCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const handleIncrementalPayment = (order: OrderListItem) => {
    setSelectedOrder(order);
    setShowIncrementalDialog(true);
  };

  const handlePayment = (order: OrderListItem) => {
    setSelectedOrder(order);
    setShowPaymentDialog(true);
  };

  // const handleSplitPayment = (order: OrderListItem) => {
  //   setSelectedOrder(order);
  //   setShowSplitPaymentDialog(true);
  // };

  const handlePaymentSuccess = () => {
    setSelectedOrder(null);
    setShowPaymentDialog(false);
    setShowSplitPaymentDialog(false);
  };
  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
    setSelectedOrderId(null);
    setCancelReason("");
  };

  const handleCancel = () => {
    if (selectedOrderId && cancelReason.trim()) {
      cancelOrder.mutate(
        {
          id: selectedOrderId,
          values: {
            reason: cancelReason.trim(),
          },
        },
        {
          onSuccess: () => {
            console.log("Orden cancelada exitosamente");
            handleCloseCancelDialog();
            // Refrescar datos si es necesario
            // floorsWithTablesQry.refetch();
            listActiveOrdersQuery.refetch();
          },
          onError: () => {
            console.log("Error al cancelar la orden");
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cobrar Órdenes</h1>
          <p className="text-muted-foreground">
            {closedOrders.length} órdenes pendientes de pago
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por # orden, mesa o mesero..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders Grid */}
      {closedOrders.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay órdenes cerradas pendientes de pago
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {closedOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Orden #{order.daily_number}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Mesa {order.table_number}{" "}
                      {order.table_name && `- ${order.table_name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.floor_name}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-orange-500 text-white"
                  >
                    Cerrada
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{order.diners_count} comensales</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    Mesero: {order.user_name}
                  </p>

                  <p className="text-muted-foreground">
                    Items: {order.items_count}
                  </p>
                </div>

                {/* Total */}
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-sm text-muted-foreground">
                    Total a Cobrar
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      order.total_pending === 0 && "text-red-500"
                    }`}
                  >
                    S/ {order.total_pending.toFixed(2)}
                  </p>
                </div>

                {order.total_pending === 0 && order.items_count === 0 ? (
                  <div className="rounded-lg bg-primary/10 p-3 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Deberia cancelar la orden
                    </p>
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCancelDialog(order.id);
                      }}
                    >
                      {/* <MoreHorizontal className="h-3 w-3" /> */}
                      Cancelar orden
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center justify-end">
                    <Button onClick={() => handlePayment(order)} size="sm">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Cobrar
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncrementalPayment(order)}
                    >
                      <Percent className="mr-2 h-4 w-4" />
                      Incremental
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Dialogs */}
      {selectedOrder && (
        <>
          <ProcessPaymentDialog
            open={showPaymentDialog}
            onOpenChange={setShowPaymentDialog}
            order={selectedOrder}
            onSuccess={handlePaymentSuccess}
          />

          <SplitPaymentDialog
            open={showSplitPaymentDialog}
            onOpenChange={setShowSplitPaymentDialog}
            order={selectedOrder}
            onSuccess={handlePaymentSuccess}
          />
        </>
      )}
      {selectedOrder && (
        <IncrementalPaymentDialog
          open={showIncrementalDialog}
          onOpenChange={setShowIncrementalDialog}
          order={selectedOrder}
          onSuccess={handlePaymentSuccess}
        />
      )}

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
            <AlertDialogCancel onClick={handleCloseCancelDialog}>
              Volver
            </AlertDialogCancel>
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
    </div>
  );
}
