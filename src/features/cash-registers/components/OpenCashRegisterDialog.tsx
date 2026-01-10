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
import { Loader2 } from "lucide-react";
import { useCashRegisters } from "@/hooks/useCashRegisters";

interface OpenCashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OpenCashRegisterDialog({
  open,
  onOpenChange,
}: OpenCashRegisterDialogProps) {
  const { openCashRegister } = useCashRegisters();
  const [initialAmount, setInitialAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(initialAmount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    openCashRegister.mutate(
      {
        initial_amount: amount,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setInitialAmount("999.00");
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir Caja</DialogTitle>
          <DialogDescription>
            Ingresa el monto inicial con el que comenzará la caja
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initial-amount">
              Monto Inicial <span className="text-destructive">*</span>
            </Label>
            <Input
              id="initial-amount"
              type="number"
              step="0.01"
              min="0"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="33"
              required
            />
            <p className="text-xs text-muted-foreground">
              Monto en efectivo con el que inicia la caja
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Apertura en la mañana..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={openCashRegister.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={openCashRegister.isPending}>
              {openCashRegister.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Abriendo...
                </>
              ) : (
                "Abrir Caja"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
