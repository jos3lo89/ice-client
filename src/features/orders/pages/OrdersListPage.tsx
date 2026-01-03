import { Loader2 } from "lucide-react";
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
import { OrderStatus } from "@/types/orders.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useOrders } from "@/hooks/useOrders";

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
  };

  return config[status] || config[OrderStatus.ABIERTA];
};

export default function OrdersListPage() {
  const navigate = useNavigate();
  const { myOrdersQuery } = useOrders();

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

  return (
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
                    #{order.daily_number}
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
                    <Button
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
