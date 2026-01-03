import LoadingRequest from "@/components/LoadingRequest";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFloors } from "@/hooks/useFloors";
import { useEffect, useState } from "react";
import TableCard from "../components/TableCard";
import { TableStatus, type Table } from "@/types/floor.type";
import { useNavigate } from "react-router-dom";

const TablesPage = () => {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const { floorsWithTablesQry } = useFloors();

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
                  {floor.tables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onClick={() => handleTableClick(table)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
export default TablesPage;
