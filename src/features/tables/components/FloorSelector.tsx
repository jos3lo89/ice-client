// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useFloorNavigationStore } from "@/stores/floorNavigationStore";
// import LoadingRequest from "@/components/LoadingRequest";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useListFloors } from "@/hooks/useFloors";

// export default function FloorSelector() {
//   const { data, isLoading, isError } = useListFloors();
//   const { selectedFloorId, setSelectedFloor } = useFloorNavigationStore();

//   if (isLoading) {
//     return <LoadingRequest />;
//   }

//   if (isError || !data) {
//     return (
//       <Alert variant="destructive">
//         <AlertTitle>Error al cargar pisos</AlertTitle>
//         <AlertDescription>
//           Hubo un error al cargar los pisos. Por favor, intenta de nuevo.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   const floors = data.data.filter((floor) => floor.is_active);

//   return (
//     <Tabs
//       value={selectedFloorId || floors[0].id}
//       onValueChange={setSelectedFloor}
//     >
//       <TabsList className="flex justify-start overflow-x-auto gap-2 p-2 wrap mx-auto">
//         {floors.map((floor) => (
//           <TabsTrigger key={floor.id} value={floor.id} className="shrink-0 p-2">
//             {floor.name}
//             <span className="text-xs text-muted-foreground">
//               ({floor._count.tables})
//             </span>
//           </TabsTrigger>
//         ))}
//       </TabsList>
//     </Tabs>
//   );
// }
