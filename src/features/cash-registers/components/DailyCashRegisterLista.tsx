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
import { useCashRegisters } from "@/hooks/useCashRegisters";
import { CashRegisterStatus } from "@/types/cash-registers.types";
import { formatDateTime } from "@/utils/formatDateTime";
import LoadingRequest from "@/components/LoadingRequest";
import ErrorRequestAlert from "@/components/ErrorRequestAlert";
import EmptyStateAlert from "@/components/EmptyStateAlert";

const DailyCashRegisterLista = () => {
  const { todayCashRegistersQuery } = useCashRegisters();

  const cashRegisters = todayCashRegistersQuery.data?.data || [];

  console.log({
    cashRegisters,
  });

  if (todayCashRegistersQuery.isLoading) {
    return <LoadingRequest />;
  }

  if (todayCashRegistersQuery.error) {
    return <ErrorRequestAlert />;
  }

  if (cashRegisters.length === 0) {
    return <EmptyStateAlert />;
  }

  const formatCurrency = (amount: number | undefined | null) =>
    amount !== undefined && amount !== null
      ? `S/ ${amount.toFixed(2)}`
      : "S/ 0.00";

  const calculateCurrentBalance = (initialAmount: number, totalSales: number) =>
    initialAmount + totalSales;

  // const calculateDifference = (
  //   expectedAmount: number,
  //   currentBalance: number
  // ) => expectedAmount - currentBalance;

  const getStatusBadge = (status: string) => {
    const isOpen = status === CashRegisterStatus.ABIERTA;
    return (
      <Badge
        variant={isOpen ? "default" : "secondary"}
        className={
          isOpen
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-600 hover:bg-gray-700"
        }
      >
        {isOpen ? "Abierta" : "Cerrada"}
      </Badge>
    );
  };

  const getDifferenceColor = (difference: number) => {
    return difference >= 0 ? "text-green-600" : "text-red-600";
  };

  const formatCloseTime = (closeTime: string | null, status: string) => {
    if (status === CashRegisterStatus.ABIERTA) {
      return "Abierta";
    }
    return closeTime ? formatDateTime(closeTime, "time") : "N/A";
  };

  return (
    <ScrollArea className="h-100 pr-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Apertura</TableHead>
              <TableHead>Cierre</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="text-right">Total Ventas</TableHead>
              <TableHead className="text-right">Monto Inicial</TableHead>
              <TableHead className="text-right">Monto Esperado</TableHead>
              <TableHead className="text-right">Saldo Calculado</TableHead>
              <TableHead className="text-right">Diferencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashRegisters.map((cashRegister) => {
              const currentBalance = calculateCurrentBalance(
                cashRegister.initial_amount,
                cashRegister.total_sales
              );
              // const difference = calculateDifference(
              //   cashRegister.expected_amount,
              //   currentBalance
              // );

              return (
                <TableRow key={cashRegister.id}>
                  <TableCell className="font-medium">
                    {cashRegister.user_name}
                  </TableCell>
                  <TableCell>{getStatusBadge(cashRegister.status)}</TableCell>
                  <TableCell>
                    {formatDateTime(cashRegister.open_time, "time")}
                  </TableCell>
                  <TableCell>
                    {formatCloseTime(
                      cashRegister.close_time,
                      cashRegister.status
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {cashRegister.sales_count}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(cashRegister.total_sales)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cashRegister.initial_amount)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(cashRegister.expected_amount)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(currentBalance)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${getDifferenceColor(
                      cashRegister.difference
                    )}`}
                  >
                    {formatCurrency(cashRegister.difference)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default DailyCashRegisterLista;
