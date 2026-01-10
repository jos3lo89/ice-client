import LoadingRequest from "@/components/LoadingRequest";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFloors } from "@/hooks/useFloors";
import { useEffect, useState, type FormEvent } from "react";
import TableCard from "../components/TableCard";
import { TableStatus, type Table } from "@/types/floor.type";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";

const TablesPage = () => {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const { floorsWithTablesQry } = useFloors();
  const [selectedTalbe, setSelectedTable] = useState<Table | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [diners, setDiners] = useState("");

  const { createOrder } = useOrders();

  const navigate = useNavigate();

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

  const handleTableClick = (table: Table) => {
    switch (table.status) {
      case TableStatus.LIBRE:
        navigate(`/tables/${table.id}/order`);
        break;

      case TableStatus.OCUPADA:
        if (table.orders && table.orders.length > 0) {
          navigate(`/orders/${table.orders[0].id}`);
          console.log("ocupada");
        }
        break;

      case TableStatus.RESERVADA:
        console.log("reservada");

        break;

      case TableStatus.LIMPIEZA:
        console.log("limpieza");

        break;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dinerCount = parseInt(diners);

    if (!selectedTalbe) {
      toast.warning("Por favor, seleccione una mesa");
      return;
    }

    if (isNaN(dinerCount) || dinerCount <= 0) {
      toast.warning("Por favor, indique un número válido de comensales");
      return;
    }

    createOrder.mutate(
      {
        table_id: selectedTalbe?.id,
        diners_count: dinerCount,
      },
      {
        onSuccess: (data) => {
          navigate(`/orders/${data.data.id}`, { replace: true });
          setSelectedTable(null);
          setDiners("");
        },
      }
    );
  };

  return (
    <>
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
                    {floor.tables.map((table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        onClick={() => {
                          if (table.status === "LIBRE") {
                            setSelectedTable(table);
                            setOpenDialog(true);
                          } else {
                            handleTableClick(table);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
      {selectedTalbe && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear orden</DialogTitle>
              <DialogDescription>
                Digita el nuumero de comensales para la mensa{" "}
                {selectedTalbe.name}
              </DialogDescription>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={diners}
                  required
                  placeholder="0"
                  onChange={(e) => setDiners(e.target.value)}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => {
                      setOpenDialog(false);
                      setSelectedTable(null);
                      setDiners("");
                    }}
                    disabled={createOrder.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button disabled={createOrder.isPending} type="submit">
                    {createOrder.isPending ? "Creando orden..." : "Crear orden"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export default TablesPage;
