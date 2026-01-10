import { Loader2, Receipt } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { OrderStatus, type OrderListItem } from "@/types/orders.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useOrders } from "@/hooks/useOrders";
import { useState } from "react";
import CloseOrderDialog from "../components/CloseOrderDialog";
import OderDetails from "../components/OderDetails";

const getStatusBadge = (status: OrderStatus) => {
  const config = {
    [OrderStatus.ABIERTA]: {
      variant: "default" as const,
      className: "bg-blue-500",
      label: "Abierta",
    },
    [OrderStatus.CERRADA]: {
      variant: "secondary" as const,
      className: "bg-orange-500 text-white",
      label: "Cerrada",
    },
    [OrderStatus.PARCIALMENTE_PAGADA]: {
      variant: "default" as const,
      className: "bg-yellow-500",
      label: "Parcial",
    },
    [OrderStatus.PAGADA]: {
      variant: "default" as const,
      className: "bg-green-500",
      label: "Pagada",
    },
    [OrderStatus.CANCELADA]: {
      variant: "destructive" as const,
      className: "",
      label: "Cancelada",
    },
    [OrderStatus.EN_PAGO_DIVIDIDO]: {
      variant: "secondary" as const,
      className: "bg-purple-500 text-white",
      label: "Pago Dividido",
    },
  };

  return config[status] || config[OrderStatus.ABIERTA];
};

export default function OrdersListPage() {
  const navigate = useNavigate();
  const { myOrdersQuery } = useOrders();

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
    null
  );
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  if (myOrdersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando órdenes...
          </p>
        </div>
      </div>
    );
  }

  if (myOrdersQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar órdenes. Intenta nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  const orders = myOrdersQuery.data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mis Órdenes</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes órdenes activas en este momento
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleCloseOrder = (order: OrderListItem) => {
    setSelectedOrder(order);
    setShowCloseDialog(true);
  };

  const gotoOrder = (order: OrderListItem) => {
    // TODO: ver esto verifcar
    setSelectedOrder(order);
    switch (order.status) {
      case "ABIERTA":
        navigate(`/orders/${order.id}`);
        break;
      case "CERRADA":
        setOpenDetailDialog(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Mis Órdenes</h1>
          <p className="text-muted-foreground">
            {orders.length}{" "}
            {orders.length === 1 ? "orden activa" : "órdenes activas"}
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Comensales</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const statusConfig = getStatusBadge(order.status);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.daily_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Mesa {order.table_number}</p>
                        {order.table_name && (
                          <p className="text-xs text-muted-foreground">
                            {order.table_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {order.floor_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{order.diners_count}</TableCell>
                    <TableCell>{order.items_count}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusConfig.variant}
                        className={statusConfig.className}
                      >
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      S/ {order.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => gotoOrder(order)}>
                          Ver
                        </Button>
                        {order.status === OrderStatus.ABIERTA && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCloseOrder(order)}
                          >
                            <Receipt className="mr-2 h-4 w-4" />
                            Cerrar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      {selectedOrder && (
        <CloseOrderDialog
          open={showCloseDialog}
          onOpenChange={setShowCloseDialog}
          order={selectedOrder}
        />
      )}

      {openDetailDialog && selectedOrder && (
        <OderDetails
          id={selectedOrder.id}
          onOpen={setOpenDetailDialog}
          open={openDetailDialog}
        />
      )}
    </>
  );
}
