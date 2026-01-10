// src/features/orders/components/OrderHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, User } from "lucide-react";
import { OrderStatus } from "@/types/orders.types";
import type { Order } from "@/types/orders.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface OrderHeaderProps {
  order: Order;
}

const getStatusConfig = (status: OrderStatus) => {
  const config = {
    [OrderStatus.ABIERTA]: {
      variant: "default" as const,
      className: "bg-blue-500 hover:bg-blue-600",
      label: "Abierta",
    },
    [OrderStatus.CERRADA]: {
      variant: "secondary" as const,
      className: "bg-orange-500 hover:bg-orange-600 text-white",
      label: "Cerrada",
    },
    [OrderStatus.PARCIALMENTE_PAGADA]: {
      variant: "default" as const,
      className: "bg-yellow-500 hover:bg-yellow-600",
      label: "Parcialmente Pagada",
    },
    [OrderStatus.PAGADA]: {
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600",
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

export default function OrderHeader({ order }: OrderHeaderProps) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Info principal */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">
                Orden #{order.daily_number}
              </h2>
              <Badge
                variant={statusConfig.variant}
                className={statusConfig.className}
              >
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">Mesa {order.table.number}</span>
                {order.table.name && <span>- {order.table.name}</span>}
                <span className="text-xs">({order.table.floor_name})</span>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{order.diners_count} comensales</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{order.user.name}</span>
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
          </div>
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="mt-4 rounded-md bg-muted p-3">
            <p className="text-sm font-medium">Notas:</p>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
