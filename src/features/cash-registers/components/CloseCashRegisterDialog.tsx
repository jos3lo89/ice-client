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
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCashRegisters } from "@/hooks/useCashRegisters";

interface CloseCashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CloseCashRegisterDialog({
  open,
  onOpenChange,
}: CloseCashRegisterDialogProps) {
  const { closeCashRegister, currentCashRegisterQuery } = useCashRegisters();
  const [finalAmount, setFinalAmount] = useState("");
  const [notes, setNotes] = useState("");
  // const navigate = useNavigate();

  const cashRegister = currentCashRegisterQuery.data?.data;
  const expectedAmount = cashRegister?.totals.current_balance || 0;
  const difference = finalAmount ? parseFloat(finalAmount) - expectedAmount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(finalAmount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    closeCashRegister.mutate(
      {
        final_amount: amount,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setFinalAmount("");
          setNotes("");
          onOpenChange(false);
          // navigate("/cashier/cash-register", { replace: true });
          location.reload();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar Caja</DialogTitle>
          <DialogDescription>
            Cuenta el efectivo en caja e ingresa el monto final
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Saldo Esperado</p>
            <p className="text-2xl font-bold">S/ {expectedAmount.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="final-amount">
              Monto Final Contado <span className="text-destructive">*</span>
            </Label>
            <Input
              id="final-amount"
              type="number"
              step="0.01"
              min="0"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground">
              Monto real de efectivo que hay en caja
            </p>
          </div>

          {finalAmount && (
            <Alert variant={difference === 0 ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {difference === 0 ? (
                  <span className="font-medium text-green-600">
                    ✓ Caja cuadrada
                  </span>
                ) : difference > 0 ? (
                  <span className="font-medium text-blue-600">
                    Sobrante: S/ {difference.toFixed(2)}
                  </span>
                ) : (
                  <span className="font-medium">
                    Faltante: S/ {Math.abs(difference).toFixed(2)}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cierre sin novedad..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={closeCashRegister.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={closeCashRegister.isPending}
              variant={difference !== 0 ? "destructive" : "default"}
            >
              {closeCashRegister.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Cerrar Caja"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
