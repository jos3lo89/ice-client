import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Plus, X } from "lucide-react";
import CashRegisterStatus from "../components/CashRegisterStatus";
import OpenCashRegisterDialog from "../components/OpenCashRegisterDialog";
import CloseCashRegisterDialog from "../components/CloseCashRegisterDialog";
import CashMovementDialog from "../components/CashMovementDialog";
import CashMovementsList from "../components/CashMovementsList";
import { useCashRegisters } from "@/hooks/useCashRegisters";
import SalesList from "../components/SalesList";
import DailyCashRegisterLista from "../components/DailyCashRegisterLista";

export default function CashRegisterPage() {
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);

  const { currentCashRegisterQuery } = useCashRegisters();

  const cashRegister = currentCashRegisterQuery.data?.data;
  const isOpen = !!cashRegister;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Caja Registradora
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu caja y movimientos de efectivo
          </p>
        </div>

        <div className="flex gap-2">
          {!isOpen ? (
            <Button onClick={() => setShowOpenDialog(true)} size="lg">
              <DollarSign className="mr-2 h-5 w-5" />
              Abrir Caja
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowMovementDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Movimiento
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowCloseDialog(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Cerrar Caja
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Estado de Caja */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <CashRegisterStatus />
        </div>

        {/* Resumen de ventas */}
        {isOpen && cashRegister && (
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ventas Totales
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      S/ {cashRegister.totals.sales.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cashRegister.sales_count} transacciones
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ingresos Manuales
                    </p>
                    <p className="text-2xl font-bold">
                      S/ {cashRegister.totals.income.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Egresos</p>
                    <p className="text-2xl font-bold text-red-600">
                      S/ {cashRegister.totals.expense.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Saldo Esperado
                    </p>
                    <p className="text-2xl font-bold">
                      S/ {cashRegister.totals.current_balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tabs - Movimientos e Historial */}
      {isOpen && (
        <Tabs defaultValue="movements" className="w-full">
          <TabsList>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="dailyCashRegister">Cajas Del dia</TabsTrigger>
          </TabsList>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Caja</CardTitle>
              </CardHeader>
              <CardContent>
                <CashMovementsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Registradas</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dailyCashRegister">
            <Card>
              <CardHeader>
                <CardTitle>Cajas del dia</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyCashRegisterLista />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialogs */}
      <OpenCashRegisterDialog
        open={showOpenDialog}
        onOpenChange={setShowOpenDialog}
      />

      <CloseCashRegisterDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
      />

      <CashMovementDialog
        open={showMovementDialog}
        onOpenChange={setShowMovementDialog}
      />
    </div>
  );
}
