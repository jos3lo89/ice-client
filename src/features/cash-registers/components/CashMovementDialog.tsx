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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import {
  CashMovementType,
  type MovementType,
} from "@/types/cash-registers.types";
import { useCashRegisters } from "@/hooks/useCashRegisters";

interface CashMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CashMovementDialog({
  open,
  onOpenChange,
}: CashMovementDialogProps) {
  const { createMovement } = useCashRegisters();

  const [type, setType] = useState<MovementType>(CashMovementType.INGRESO);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0 || !description.trim()) {
      return;
    }

    createMovement.mutate(
      {
        type,
        amount: amountValue,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setAmount("");
          setDescription("");
          setType(CashMovementType.INGRESO);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Movimiento de Caja</DialogTitle>
          <DialogDescription>
            Ingreso o egreso manual de efectivo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Tipo de Movimiento</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as MovementType)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`relative flex cursor-pointer items-center space-x-2 rounded-lg border p-4 ${
                    type === CashMovementType.INGRESO
                      ? "border-green-500"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <RadioGroupItem
                    value={CashMovementType.INGRESO}
                    id="ingreso"
                  />
                  <Label
                    htmlFor="ingreso"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Ingreso</p>
                      <p className="text-xs text-muted-foreground">
                        Añade efectivo
                      </p>
                    </div>
                  </Label>
                </div>

                <div
                  className={`relative flex cursor-pointer items-center space-x-2 rounded-lg border p-4 ${
                    type === CashMovementType.EGRESO
                      ? "border-red-500"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <RadioGroupItem value={CashMovementType.EGRESO} id="egreso" />
                  <Label
                    htmlFor="egreso"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Egreso</p>
                      <p className="text-xs text-muted-foreground">
                        Retira efectivo
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Monto <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === CashMovementType.INGRESO
                  ? "Ej: Aporte de fondo fijo"
                  : "Ej: Compra de insumos de limpieza"
              }
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMovement.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMovement.isPending}
              variant={
                type === CashMovementType.INGRESO ? "default" : "destructive"
              }
            >
              {createMovement.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                `Registrar ${
                  type === CashMovementType.INGRESO ? "Ingreso" : "Egreso"
                }`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
