import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { TableStatus } from "@/types/table.types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import TableStatusBadge from "./TableStatusBadge";
import type { Table } from "@/types/floor.type";

interface TableCardProps {
  table: Table;
  onClick: () => void;
}

export default function TableCard({ table, onClick }: TableCardProps) {
  const isOccupied = table.status === TableStatus.OCUPADA;
  const hasActiveOrder = table.orders && table.orders.length > 0;
  const activeOrder = hasActiveOrder ? table.orders[0] : null;

  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Mesa {table.number}</h3>
          </div>
          <TableStatusBadge status={table.status as TableStatus} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{table.capacity} personas</span>
        </div> */}

        {isOccupied && activeOrder && (
          <div className="space-y-2 rounded-md border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                Orden #{activeOrder.daily_number}
              </span>
              <Badge variant="outline" className="text-xs">
                S/ {activeOrder.subtotal.toFixed(2)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(activeOrder.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>

            {activeOrder.user && (
              <p className="text-xs text-muted-foreground">
                Mesero: {activeOrder.user.name}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
