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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Percent } from "lucide-react";
import {
  PaymentMethod,
  ComprobanteType,
  type PaymentMethodT,
  type IncrementalPaymentItem,
} from "@/types/payments.types";
import type { OrderListItem } from "@/types/orders.types";
import { usePayments } from "@/hooks/usePayments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface IncrementalPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderListItem;
  onSuccess?: () => void;
}

interface PaymentSplit {
  id: string;
  payerName: string;
  paymentMethod: PaymentMethodT;
  amountReceived: string;
  payerNotes: string;
  itemAllocations: Array<{
    itemId: string;
    quantity: number;
    amount: string;
  }>;
}

export default function IncrementalPaymentDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: IncrementalPaymentDialogProps) {
  const { processIncrementalPayment, usePaymentProgress } = usePayments();
  const progressQuery = usePaymentProgress(order.id);

  const [splits, setSplits] = useState<PaymentSplit[]>([
    {
      id: "1",
      payerName: "",
      paymentMethod: PaymentMethod.EFECTIVO,
      amountReceived: "",
      payerNotes: "",
      itemAllocations: [],
    },
  ]);

  // Items disponibles con progreso de pago
  const itemsWithProgress = progressQuery.data?.data.items || [];
  const availableItems = itemsWithProgress.filter(
    (item) => !item.is_fully_paid
  );

  const addSplit = () => {
    setSplits([
      ...splits,
      {
        id: Date.now().toString(),
        payerName: "",
        paymentMethod: PaymentMethod.EFECTIVO,
        amountReceived: "",
        payerNotes: "",
        itemAllocations: [],
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

  const addItemAllocation = (splitId: string) => {
    setSplits(
      splits.map((split) => {
        if (split.id === splitId) {
          return {
            ...split,
            itemAllocations: [
              ...split.itemAllocations,
              { itemId: "", quantity: 0, amount: "" },
            ],
          };
        }
        return split;
      })
    );
  };

  const removeItemAllocation = (splitId: string, index: number) => {
    setSplits(
      splits.map((split) => {
        if (split.id === splitId) {
          return {
            ...split,
            itemAllocations: split.itemAllocations.filter(
              (_, i) => i !== index
            ),
          };
        }
        return split;
      })
    );
  };

  const updateItemAllocation = (
    splitId: string,
    index: number,
    field: "itemId" | "quantity" | "amount",
    value: any
  ) => {
    setSplits(
      splits.map((split) => {
        if (split.id === splitId) {
          const newAllocations = [...split.itemAllocations];
          newAllocations[index] = { ...newAllocations[index], [field]: value };

          // Auto-calcular monto si cambia cantidad
          if (field === "itemId" || field === "quantity") {
            const item = availableItems.find(
              (i) => i.id === newAllocations[index].itemId
            );
            if (item && newAllocations[index].quantity > 0) {
              const quantity = Number(newAllocations[index].quantity);
              // const unitPrice = Number(item.unit_price);
              const unitPrice = Number(item.amount);
              newAllocations[index].amount = (quantity * unitPrice).toFixed(2);
            }
          }

          return { ...split, itemAllocations: newAllocations };
        }
        return split;
      })
    );
  };

  const calculateSplitTotal = (split: PaymentSplit) => {
    return split.itemAllocations.reduce(
      (sum, alloc) => sum + (parseFloat(alloc.amount) || 0),
      0
    );
  };

  const totalAssigned = splits.reduce(
    (sum, split) => sum + calculateSplitTotal(split),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payments: IncrementalPaymentItem[] = splits.map((split) => ({
      payer_name: split.payerName,
      payment_method: split.paymentMethod,
      amount: calculateSplitTotal(split),
      amount_received:
        split.paymentMethod === PaymentMethod.EFECTIVO
          ? parseFloat(split.amountReceived)
          : undefined,
      generate_document: true,
      document_type: ComprobanteType.BOLETA,
      payer_notes: split.payerNotes || undefined,
      item_allocations: split.itemAllocations.map((alloc) => ({
        item_id: alloc.itemId,
        quantity: alloc.quantity,
        amount: parseFloat(alloc.amount),
      })),
    }));

    processIncrementalPayment.mutate(
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
      splits.length > 0 &&
      splits.every((split) => {
        const total = calculateSplitTotal(split);
        return (
          split.payerName.trim() &&
          split.itemAllocations.length > 0 &&
          split.itemAllocations.every(
            (alloc) =>
              alloc.itemId && alloc.quantity > 0 && parseFloat(alloc.amount) > 0
          ) &&
          total > 0 &&
          (split.paymentMethod !== PaymentMethod.EFECTIVO ||
            parseFloat(split.amountReceived) >= total)
        );
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Pago Incremental por Items
          </DialogTitle>
          <DialogDescription>
            Orden #{order.daily_number} - Mesa {order.table_number} - Permite
            pagar cantidades parciales de cada item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Progreso general */}
          {progressQuery.data && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progreso de pago</span>
                    <span className="font-medium">
                      {progressQuery.data.data.payment_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={progressQuery.data.data.payment_percentage}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Pagado: S/ {progressQuery.data.data.total_paid.toFixed(2)}
                    </span>
                    <span>
                      Pendiente: S/{" "}
                      {progressQuery.data.data.total_pending.toFixed(2)}
                    </span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-125 pr-4">
            <div className="space-y-6">
              {splits.map((split, splitIndex) => {
                const splitTotal = calculateSplitTotal(split);
                const change =
                  split.paymentMethod === PaymentMethod.EFECTIVO &&
                  split.amountReceived
                    ? parseFloat(split.amountReceived) - splitTotal
                    : 0;

                return (
                  <div
                    key={split.id}
                    className="rounded-lg border p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Pago {splitIndex + 1}</h4>
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

                    {/* Datos del pagador */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre del Pagador</Label>
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
                        <Select
                          value={split.paymentMethod}
                          onValueChange={(v) =>
                            updateSplit(
                              split.id,
                              "paymentMethod",
                              v as PaymentMethodT
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={PaymentMethod.EFECTIVO}>
                              Efectivo
                            </SelectItem>
                            <SelectItem value={PaymentMethod.YAPE}>
                              Yape
                            </SelectItem>
                            <SelectItem value={PaymentMethod.PLIN}>
                              Plin
                            </SelectItem>
                            <SelectItem value={PaymentMethod.TARJETA_VISA}>
                              Tarjeta
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Items a pagar */}
                    <div className="space-y-2">
                      <Label>Items y Cantidades a Pagar</Label>

                      {split.itemAllocations.map((alloc, allocIndex) => {
                        const item = availableItems.find(
                          (i) => i.id === alloc.itemId
                        );

                        return (
                          <div
                            key={allocIndex}
                            className="grid grid-cols-12 gap-2 items-end"
                          >
                            <div className="col-span-12 space-y-1">
                              <Label className="text-xs">Producto</Label>
                              <Select
                                value={alloc.itemId}
                                onValueChange={(v) =>
                                  updateItemAllocation(
                                    split.id,
                                    allocIndex,
                                    "itemId",
                                    v
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione item" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      <div className="flex flex-col">
                                        <span>{item.product_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          Disponible: {item.remaining_amount}{" "}
                                          {/* x S/ {item.unit_price} = S/{" "} */}
                                          x S/ {item.amount} = S/{" "}
                                          {item.remaining_amount.toFixed(2)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-2 space-y-1">
                              <Label className="text-xs">Cantidad</Label>
                              <Input
                                type="number"
                                step="1"
                                min="1"
                                max={item?.remaining_amount || 999}
                                value={alloc.quantity || ""}
                                onChange={(e) =>
                                  updateItemAllocation(
                                    split.id,
                                    allocIndex,
                                    "quantity",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder=""
                              />
                            </div>

                            <div className="col-span-3 space-y-1">
                              <Label className="text-xs">Monto</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={alloc.amount}
                                onChange={(e) =>
                                  updateItemAllocation(
                                    split.id,
                                    allocIndex,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>

                            <div className="col-span-2 flex items-center justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeItemAllocation(split.id, allocIndex)
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItemAllocation(split.id)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Item
                      </Button>
                    </div>

                    {/* Totales */}
                    <div className="rounded-lg bg-muted p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total a Pagar:</span>
                        <span className="font-bold">
                          S/ {splitTotal.toFixed(2)}
                        </span>
                      </div>

                      {split.paymentMethod === PaymentMethod.EFECTIVO && (
                        <>
                          <div className="space-y-1">
                            <Label className="text-xs">Monto Recibido</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min={splitTotal}
                              value={split.amountReceived}
                              onChange={(e) =>
                                updateSplit(
                                  split.id,
                                  "amountReceived",
                                  e.target.value
                                )
                              }
                              placeholder={splitTotal.toFixed(2)}
                            />
                          </div>

                          {change > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Vuelto:</span>
                              <span className="font-medium">
                                S/ {change.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Notas */}
                    <div className="space-y-2">
                      <Label className="text-xs">Notas (opcional)</Label>
                      <Input
                        value={split.payerNotes}
                        onChange={(e) =>
                          updateSplit(split.id, "payerNotes", e.target.value)
                        }
                        placeholder="Notas adicionales..."
                      />
                    </div>
                  </div>
                );
              })}

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

          {/* Resumen final */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Pendiente</p>
              <p className="text-xl font-bold">
                S/ {order.total_pending.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total a Pagar</p>
              <p className="text-xl font-bold text-primary">
                S/ {totalAssigned.toFixed(2)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processIncrementalPayment.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit() || processIncrementalPayment.isPending}
            >
              {processIncrementalPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                `Procesar ${splits.length} Pago(s) Incremental(es)`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
