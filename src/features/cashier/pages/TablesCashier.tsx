import LoadingRequest from "@/components/LoadingRequest";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TableStatusBadge from "@/features/tables/components/TableStatusBadge";
import { useFloors } from "@/hooks/useFloors";
import { useOrders } from "@/hooks/useOrders";
import { TableStatus } from "@/types/floor.type";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceTime } from "@/utils/formatDistanceTime";

const TablesCashier = () => {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { floorsWithTablesQry } = useFloors();
  const { cancelOrder } = useOrders();

  useEffect(() => {
    if (
      floorsWithTablesQry.data?.data &&
      floorsWithTablesQry.data?.data.length > 0 &&
      !selectedFloorId
    ) {
      setSelectedFloorId(floorsWithTablesQry.data?.data[0].id);
    }
  }, [floorsWithTablesQry.data?.data, selectedFloorId]);

  if (floorsWithTablesQry.isLoading) {
    return <LoadingRequest />;
  }

  if (floorsWithTablesQry.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error al cargar datos</AlertTitle>
        <AlertDescription>
          Hubo un error al cargar los datos. Por favor, intenta de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  const handleOpenCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
    setSelectedOrderId(null);
    setCancelReason("");
  };

  const handleCancel = () => {
    if (selectedOrderId && cancelReason.trim()) {
      cancelOrder.mutate(
        {
          id: selectedOrderId,
          values: {
            reason: cancelReason.trim(),
          },
        },
        {
          onSuccess: () => {
            handleCloseCancelDialog();
            floorsWithTablesQry.refetch();
          },
          onError: () => {
            console.log("Error al cancelar la orden");
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {floorsWithTablesQry.data?.data && (
        <Tabs value={selectedFloorId} onValueChange={setSelectedFloorId}>
          <TabsList className="flex justify-start overflow-x-auto gap-2 p-2 wrap mx-auto">
            {floorsWithTablesQry.data?.data.map((floor) => (
              <TabsTrigger key={floor.id} value={floor.id}>
                {floor.name}
                <span className="text-xs text-muted-foreground">
                  ({floor._count.tables})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {floorsWithTablesQry.data?.data.map((floor) => (
            <TabsContent key={floor.id} value={floor.id}>
              {floor.tables.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No hay mesas en este piso.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {floor.tables.map((table) => {
                    const isOccupied = table.status === TableStatus.OCUPADA;
                    const hasActiveOrder =
                      table.orders && table.orders.length > 0;
                    const activeOrder = hasActiveOrder ? table.orders[0] : null;

                    return (
                      <Card key={table.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold">
                                Mesa {table.number}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <TableStatusBadge
                                status={table.status as TableStatus}
                              />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-2">
                          {isOccupied && activeOrder && (
                            <div className="space-y-2 rounded-md border bg-background p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  Orden #{activeOrder.daily_number}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  S/ {activeOrder.subtotal.toFixed(2)}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDistanceTime(activeOrder.created_at)}
                                </span>
                              </div>

                              {activeOrder.user && (
                                <p className="text-xs text-muted-foreground">
                                  Mesero: {activeOrder.user.name}
                                </p>
                              )}
                            </div>
                          )}

                          {isOccupied && activeOrder && (
                            <Button
                              variant="destructive"
                              className="cursor-pointer"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCancelDialog(activeOrder.id);
                              }}
                            >
                              {/* <MoreHorizontal className="h-3 w-3" /> */}
                              Cancelar orden
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* AlertDialog para cancelar orden */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Orden</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará todos los items de la orden.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">
              Motivo de cancelación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Ingresa el motivo..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseCancelDialog}>
              Volver
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={!cancelReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Cancelación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default TablesCashier;
