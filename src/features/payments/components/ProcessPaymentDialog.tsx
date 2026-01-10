// src/features/payments/components/ProcessPaymentDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
} from "lucide-react";
import {
  PaymentMethod,
  ComprobanteType,
  type PaymentMethodT,
  type ComprobanteTypeT,
} from "@/types/payments.types";
import type { OrderListItem } from "@/types/orders.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePayments } from "@/hooks/usePayments";
import { useClients } from "@/hooks/useClients";
import type { ClientI } from "@/types/clients.type";

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderListItem;
  onSuccess?: () => void;
}

const paymentMethods = [
  { value: PaymentMethod.EFECTIVO, label: "Efectivo", icon: Banknote },
  { value: PaymentMethod.YAPE, label: "Yape", icon: Smartphone },
  { value: PaymentMethod.PLIN, label: "Plin", icon: Smartphone },
  {
    value: PaymentMethod.TRANSFERENCIA,
    label: "Transferencia",
    icon: Building2,
  },
  { value: PaymentMethod.TARJETA_VISA, label: "Visa", icon: CreditCard },
  {
    value: PaymentMethod.TARJETA_MASTERCARD,
    label: "Mastercard",
    icon: CreditCard,
  },
];

export default function ProcessPaymentDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: ProcessPaymentDialogProps) {
  const { processPayment } = usePayments();
  const { listClientsrQry } = useClients();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodT>(
    PaymentMethod.EFECTIVO
  );
  const [documentType, setDocumentType] = useState<ComprobanteTypeT>(
    ComprobanteType.TICKET
  );
  const [amountReceived, setAmountReceived] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientI | null>(null);
  const [payerNotes, setPayerNotes] = useState("");
  const clients = listClientsrQry.data?.data || [];

  // Set default client when clients are loaded
  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      const defaultClient =
        clients.find((c) => c.numero_documento === "00000000") || clients[0];
      setSelectedClient(defaultClient);
    }
  }, [clients, selectedClient]);

  const totalPending = order.total_pending;
  const isEffective = paymentMethod === PaymentMethod.EFECTIVO;
  const received = parseFloat(amountReceived) || 0;
  const change =
    isEffective && received > totalPending ? received - totalPending : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEffective && received < totalPending) {
      return;
    }
    console.log({
      order_id: order.id,
      payment_method: paymentMethod,
      amount: totalPending,
      amount_received: isEffective ? received : undefined,
      generate_document: true,
      document_type: documentType,
      client_id: selectedClient?.id,
      payer_notes: payerNotes.trim() || undefined,
    });
    processPayment.mutate(
      {
        order_id: order.id,
        payment_method: paymentMethod,
        amount: totalPending,
        amount_received: isEffective ? received : undefined,
        generate_document: true,
        document_type: documentType,
        client_id: selectedClient?.id,
        payer_notes: payerNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setAmountReceived("");
          setPayerNotes("");
          setSelectedClient(null);
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
          <DialogDescription>
            Orden #{order.daily_number} - Mesa {order.table_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total a pagar */}
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Total a Pagar</p>
            <p className="text-3xl font-bold">S/ {totalPending.toFixed(2)}</p>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de Pago</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethodT)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Seleccione método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      <method.icon className="h-4 w-4" />
                      <span>{method.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monto recibido (solo efectivo) */}
          {isEffective && (
            <div className="space-y-2">
              <Label htmlFor="amount-received">
                Monto Recibido <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount-received"
                type="number"
                step="0.01"
                min={totalPending}
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder={totalPending.toFixed(2)}
                required
              />

              {change > 0 && (
                <Alert>
                  <AlertDescription>
                    <span className="font-medium">
                      Vuelto: S/ {change.toFixed(2)}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Tipo de comprobante */}
          <div className="space-y-3">
            <Label>Tipo de Comprobante</Label>
            <Tabs
              value={documentType}
              onValueChange={(v) => setDocumentType(v as ComprobanteTypeT)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value={ComprobanteType.TICKET}>Ticket</TabsTrigger>
                <TabsTrigger value={ComprobanteType.BOLETA}>Boleta</TabsTrigger>
                <TabsTrigger value={ComprobanteType.FACTURA}>
                  Factura
                </TabsTrigger>
              </TabsList>

              <TabsContent value={ComprobanteType.TICKET} className="mt-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select
                    value={selectedClient?.id || ""}
                    onValueChange={(value) => {
                      const client = clients.find((c) => c.id === value);
                      setSelectedClient(client || null);
                    }}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sin cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.razon_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="payer-notes">Notas del pago (opcional)</Label>
                  <Input
                    id="payer-notes"
                    value={payerNotes}
                    onChange={(e) => setPayerNotes(e.target.value)}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </TabsContent>
              <TabsContent value={ComprobanteType.BOLETA} className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Se requiere DNI del cliente
                </p>
              </TabsContent>
              <TabsContent value={ComprobanteType.FACTURA} className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Se requiere cliente con RUC
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processPayment.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                processPayment.isPending ||
                (isEffective && (received < totalPending || !amountReceived))
              }
            >
              {processPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Procesar Pago"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
