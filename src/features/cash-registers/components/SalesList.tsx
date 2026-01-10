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
import {  FileText, Receipt, FileCheck } from "lucide-react";
import { useCashRegisters } from "@/hooks/useCashRegisters";
import { formatDateTime } from "@/utils/formatDateTime";
import LoadingRequest from "@/components/LoadingRequest";

export default function SalesList() {
  const { currentSalesQuery } = useCashRegisters();

  if (currentSalesQuery.isLoading) {
    return <LoadingRequest />;
  }

  const sales = currentSalesQuery.data?.data || [];

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay ventas registradas
      </div>
    );
  }

  const getComprobanteIcon = (tipo: string) => {
    switch (tipo) {
      case "TICKET":
        return <FileText className="h-4 w-4" />;
      case "BOLETA":
        return <Receipt className="h-4 w-4" />;
      case "FACTURA":
        return <FileCheck className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getComprobanteColor = (tipo: string) => {
    switch (tipo) {
      case "TICKET":
        return "bg-gray-500";
      case "BOLETA":
        return "bg-blue-500";
      case "FACTURA":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <ScrollArea className="h-100 pr-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Comprobante</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Método Pago</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>
                <Badge
                  variant="default"
                  className={`gap-1 ${getComprobanteColor(
                    sale.tipo_comprobante
                  )}`}
                >
                  {getComprobanteIcon(sale.tipo_comprobante)}
                  {sale.tipo_comprobante}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {sale.numero_completo}
              </TableCell>
              <TableCell>{sale.client_name || "Público general"}</TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {sale.payment_method}
                </span>
              </TableCell>
              <TableCell className="text-right font-bold">
                S/ {sale.precio_venta_total.toFixed(2)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(sale.created_at, "time")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
