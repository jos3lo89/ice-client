import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { PaymentMethod, ComprobanteType } from "@/types/payments.types";
import type { OrderListItem } from "@/types/orders.types";
import type { PaymentMethodT, SplitPaymentItem } from "@/types/payments.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { usePayments } from "@/hooks/usePayments";

interface SplitPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderListItem;
  onSuccess?: () => void;
}

interface PaymentSplit {
  id: string;
  payerName: string;
  paymentMethod: PaymentMethodT;
  amount: string;
  amountReceived: string;
  itemIds: string[];
}

export default function SplitPaymentDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: SplitPaymentDialogProps) {
  const { processSplitPayment } = usePayments();

  const [splits, setSplits] = useState<PaymentSplit[]>([
    {
      id: "1",
      payerName: "",
      paymentMethod: PaymentMethod.EFECTIVO,
      amount: "",
      amountReceived: "",
      itemIds: [],
    },
  ]);

  const activeItems = order.order_items.filter(
    (item) => !item.is_cancelled && !item.is_paid
  );

  const addSplit = () => {
    setSplits([
      ...splits,
      {
        id: Date.now().toString(),
        payerName: "",
        paymentMethod: PaymentMethod.EFECTIVO,
        amount: "",
        amountReceived: "",
        itemIds: [],
      },
    ]);
  };

  const removeSplit = (id: string) => {
    if (splits.length > 1) {
      setSplits(splits.filter((s) => s.id !== id));
    }
  };

  const updateSplit = (id: string, field: keyof PaymentSplit, value: any) => {
    setSplits(splits.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const toggleItem = (splitId: string, itemId: string) => {
    setSplits(
      splits.map((split) => {
        if (split.id === splitId) {
          const itemIds = split.itemIds.includes(itemId)
            ? split.itemIds.filter((id) => id !== itemId)
            : [...split.itemIds, itemId];
          return { ...split, itemIds };
        }
        return split;
      })
    );
  };

  const totalAssigned = splits.reduce(
    (sum, split) => sum + (parseFloat(split.amount) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payments: SplitPaymentItem[] = splits.map((split) => ({
      payer_name: split.payerName,
      payment_method: split.paymentMethod,
      amount: parseFloat(split.amount),
      amount_received:
        split.paymentMethod === PaymentMethod.EFECTIVO
          ? parseFloat(split.amountReceived)
          : undefined,
      item_ids: split.itemIds,
      generate_document: true,
      document_type: ComprobanteType.BOLETA,
    }));

    processSplitPayment.mutate(
      {
        order_id: order.id,
        payments,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const canSubmit = () => {
    return (
      splits.every(
        (s) =>
          s.payerName.trim() &&
          parseFloat(s.amount) > 0 &&
          s.itemIds.length > 0 &&
          (s.paymentMethod !== PaymentMethod.EFECTIVO ||
            parseFloat(s.amountReceived) >= parseFloat(s.amount))
      ) && Math.abs(totalAssigned - order.total_pending) < 0.01
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pago Dividido
          </DialogTitle>
          <DialogDescription>
            Orden #{order.daily_number} - Mesa {order.table_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ScrollArea className="h-125 pr-4">
            <div className="space-y-6">
              {splits.map((split, index) => (
                <div key={split.id} className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Pago {index + 1}</h4>
                    {splits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSplit(split.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del Comensal</Label>
                      <Input
                        value={split.payerName}
                        onChange={(e) =>
                          updateSplit(split.id, "payerName", e.target.value)
                        }
                        placeholder="Ej: Juan"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Método de Pago</Label>
                      <RadioGroup
                        value={split.paymentMethod}
                        onValueChange={(v) =>
                          updateSplit(split.id, "paymentMethod", v)
                        }
                      >
                        <div className="flex gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={PaymentMethod.EFECTIVO}
                              id={`${split.id}-efectivo`}
                            />
                            <Label htmlFor={`${split.id}-efectivo`}>
                              Efectivo
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={PaymentMethod.YAPE}
                              id={`${split.id}-yape`}
                            />
                            <Label htmlFor={`${split.id}-yape`}>Yape</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={PaymentMethod.TARJETA_VISA}
                              id={`${split.id}-tarjeta`}
                            />
                            <Label htmlFor={`${split.id}-tarjeta`}>
                              Tarjeta
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Items a Pagar</Label>
                    <div className="rounded-md border p-3 space-y-2 max-h-40 overflow-y-auto">
                      {activeItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${split.id}-${item.id}`}
                              checked={split.itemIds.includes(item.id)}
                              onCheckedChange={() =>
                                toggleItem(split.id, item.id)
                              }
                            />
                            <Label
                              htmlFor={`${split.id}-${item.id}`}
                              className="cursor-pointer"
                            >
                              {item.quantity}x {item.product_name}
                            </Label>
                          </div>
                          <span className="text-sm font-medium">
                            S/ {parseFloat(item.line_total).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monto a Pagar</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={split.amount}
                        onChange={(e) =>
                          updateSplit(split.id, "amount", e.target.value)
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {split.paymentMethod === PaymentMethod.EFECTIVO && (
                      <div className="space-y-2">
                        <Label>Monto Recibido</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min={split.amount || "0"}
                          value={split.amountReceived}
                          onChange={(e) =>
                            updateSplit(
                              split.id,
                              "amountReceived",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {split.paymentMethod === PaymentMethod.EFECTIVO &&
                    split.amount &&
                    split.amountReceived && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Vuelto: </span>
                        <span className="font-medium">
                          S/{" "}
                          {(
                            parseFloat(split.amountReceived) -
                            parseFloat(split.amount)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSplit}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Otro Pago
              </Button>
            </div>
          </ScrollArea>

          <Separator />

          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Orden</p>
              <p className="text-xl font-bold">
                S/ {order.total_pending.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Asignado</p>
              <p
                className={`text-xl font-bold ${
                  Math.abs(totalAssigned - order.total_pending) < 0.01
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                S/ {totalAssigned.toFixed(2)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processSplitPayment.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit() || processSplitPayment.isPending}
            >
              {processSplitPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                `Procesar ${splits.length} Pagos`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
