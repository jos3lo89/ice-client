// import { useNavigate } from "react-router-dom";
// import TableCard from "./TableCard";
// import { Loader2, RefreshCcw } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";
// import { TableStatus } from "@/types/table.types";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useEffect, useState } from "react";
// import { useTables } from "@/hooks/useTables";
// import { useFloorNavigationStore } from "@/stores/floorNavigationStore";
// import LoadingRequest from "@/components/LoadingRequest";
// import { useListFloors } from "@/hooks/useFloors";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card } from "@/components/ui/card";

// export default function TableGrid() {
//   const navigate = useNavigate();
//   const { selectedFloorId, setSelectedFloor } = useFloorNavigationStore();
//   const [confirmDialog, setConfirmDialog] = useState<{
//     open: boolean;
//     tableId: string;
//     tableName: string;
//     action: "clean" | "reserve";
//   } | null>(null);

//   const { changeTableStatus, listTablesQuery } = useTables();
//   const { data: floors } = useListFloors();

//   useEffect(() => {
//     console.log("entro al useEffect");

//     if (floors?.data && floors.data.length > 0 && !selectedFloorId) {
//       console.log("entro al if");
//       setSelectedFloor(floors.data[0].id);
//     }
//   }, [floors, selectedFloorId]);

//   if (!selectedFloorId) {
//     return (
//       <Alert>
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Selecciona un piso</AlertTitle>
//         <AlertDescription>
//           Por favor, selecciona un piso para ver las mesas disponibles.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (listTablesQuery.isLoading) {
//     return <LoadingRequest />;
//   }

//   if (listTablesQuery.isError) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>
//           No se pudieron cargar las mesas. Intenta nuevamente.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   const tables = listTablesQuery.data?.data || [];

//   if (tables.length === 0) {
//     return (
//       <Alert>
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Sin mesas</AlertTitle>
//         <AlertDescription>
//           No hay mesas configuradas en este piso.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   const handleTableClick = (table: (typeof tables)[0]) => {
//     console.log(table.status);
//     // switch (table.status) {
//     //   case TableStatus.LIBRE:
//     //     navigate(`/tables/${table.id}/order`);
//     //     break;

//     //   case TableStatus.OCUPADA:
//     //     if (table.orders && table.orders.length > 0) {
//     //       navigate(`/orders/${table.orders[0].id}`);
//     //     }
//     //     break;

//     //   case TableStatus.RESERVADA:
//     //     setConfirmDialog({
//     //       open: true,
//     //       tableId: table.id,
//     //       tableName: `Mesa ${table.number}`,
//     //       action: "reserve",
//     //     });
//     //     break;

//     //   case TableStatus.LIMPIEZA:
//     //     setConfirmDialog({
//     //       open: true,
//     //       tableId: table.id,
//     //       tableName: `Mesa ${table.number}`,
//     //       action: "clean",
//     //     });
//     //     break;
//     // }
//   };

//   const handleConfirm = () => {
//     if (!confirmDialog) return;

//     const newStatus =
//       confirmDialog.action === "clean"
//         ? TableStatus.LIBRE
//         : TableStatus.OCUPADA;

//     changeTableStatus.mutate(
//       {
//         tableId: confirmDialog.tableId,
//         status: { status: newStatus },
//       },
//       {
//         onSuccess: () => {
//           setConfirmDialog(null);
//           if (confirmDialog.action === "reserve") {
//             navigate(`/tables/${confirmDialog.tableId}/order`);
//           }
//         },
//       },
//     );
//   };

//   const newFloors = floors?.data.filter((floor) => floor.is_active === true);
//   const newTables = tables.filter(
//     (table) => table.floor_id === selectedFloorId,
//   );

//   return (
//     <>
//       <div className="space-y-6">
//         {newFloors && (
//           <Tabs value={selectedFloorId} onValueChange={setSelectedFloor}>
//             <TabsList className="flex justify-start overflow-x-auto gap-2 p-2 wrap mx-auto">
//               {newFloors.map((floor) => (
//                 <TabsTrigger
//                   key={floor.id}
//                   value={floor.id}
//                   className="shrink-0 p-2"
//                 >
//                   {floor.name}
//                   <span className="text-xs text-muted-foreground">
//                     ({floor._count.tables})
//                   </span>
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             {newFloors.map((floor) => (
//               <TabsContent key={floor.id} value={floor.id}>
//                 <Card className="p-5">
//                   {newTables.length === 0 ? (
//                     <p className="text-center text-muted-foreground">
//                       No hay mesas en este piso.
//                     </p>
//                   ) : (
//                     <div className="flex flex-wrap gap-2 justify-center">
//                       {newTables.map((table) => (
//                         <TableCard
//                           key={table.id}
//                           table={table}
//                           onClick={() => handleTableClick(table)}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </Card>
//               </TabsContent>
//             ))}
//           </Tabs>
//         )}
//       </div>

//       {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {newTables.map((table) => (
//           <TableCard
//             key={table.id}
//             table={table}
//             onClick={() => handleTableClick(table)}
//           />
//         ))}
//       </div> */}

//       {/* Dialog de confirmación */}
//       <AlertDialog
//         open={confirmDialog?.open || false}
//         onOpenChange={(open) => !open && setConfirmDialog(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {confirmDialog?.action === "clean"
//                 ? "Marcar como limpia"
//                 : "Confirmar atención"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {confirmDialog?.action === "clean"
//                 ? `¿La ${confirmDialog.tableName} ya está limpia y lista para usar?`
//                 : `¿Deseas atender la reserva de ${confirmDialog?.tableName}?`}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancelar</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleConfirm}
//               disabled={changeTableStatus.isPending}
//             >
//               {changeTableStatus.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Procesando...
//                 </>
//               ) : (
//                 "Confirmar"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
