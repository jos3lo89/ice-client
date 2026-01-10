import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { CashMovementType } from "@/types/cash-registers.types";
import { useCashRegisters } from "@/hooks/useCashRegisters";
import { formatDateTime } from "@/utils/formatDateTime";

export default function CashMovementsList() {
  const { currentMovementsQuery } = useCashRegisters();

  if (currentMovementsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const movements = currentMovementsQuery.data?.data || [];

  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay movimientos registrados
      </div>
    );
  }

  return (
    <ScrollArea className="h-100 pr-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                {movement.type === CashMovementType.INGRESO ? (
                  <Badge variant="default" className="bg-green-600 gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Ingreso
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Egreso
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{movement.description}</p>
                  {movement.is_automatic && (
                    <p className="text-xs text-muted-foreground">Automático</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {movement.type === CashMovementType.INGRESO ? "+" : "-"}S/{" "}
                {movement.amount.toFixed(2)}
              </TableCell>
              <TableCell>{movement.created_by || "Sistema"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(movement.created_at, "time")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
