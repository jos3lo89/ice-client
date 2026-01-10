import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useCashRegisters } from "@/hooks/useCashRegisters";

export default function CashRegisterStatus() {
  const { currentCashRegisterQuery } = useCashRegisters();

  if (currentCashRegisterQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const cashRegister = currentCashRegisterQuery.data?.data;

  if (!cashRegister) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Caja Registradora</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Sin caja abierta</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Caja Registradora</CardTitle>
          <Badge variant="default" className="bg-green-600">
            ABIERTA
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Abierta hace{" "}
            {formatDistanceToNow(new Date(cashRegister.open_time), {
              locale: es,
            })}
          </span>
        </div>

        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Saldo Actual</span>
          </div>
          <p className="mt-1 text-2xl font-bold">
            S/ {cashRegister.totals.current_balance.toFixed(2)}
          </p>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Ventas</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="font-semibold">
                S/ {cashRegister.totals.sales.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {cashRegister.sales_count} transacciones
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Egresos</p>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <p className="font-semibold">
                S/ {cashRegister.totals.expense.toFixed(2)}
              </p>
            </div>
          </div>
        </div> */}

        <div className="text-xs text-muted-foreground">
          <p>Monto inicial: S/ {cashRegister.initial_amount.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
