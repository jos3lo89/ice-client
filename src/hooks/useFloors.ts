import { floorsApi } from "@/api/endpoints/floors.api";
import { useQuery } from "@tanstack/react-query";

// export const useListFloors = () => {
//   return useQuery({
//     queryKey: ["floors"],
//     queryFn: floorsApi.listFloors,
//     staleTime: 1000 * 60 * 5,
//   });
// };

export const useFloors = () => {
  const listFloorsQuery = useQuery({
    queryKey: ["floors"],
    queryFn: floorsApi.listFloors,
    staleTime: 1000 * 60 * 5,
  });

  const useFloorById = (floorId: string) => {
    return useQuery({
      queryKey: ["floors", floorId],
      queryFn: () => floorsApi.detailsFloor(floorId),
      enabled: !!floorId,
      staleTime: 1000 * 60 * 5,
    });
  };

  const floorsWithTablesQuery = useQuery({
    queryKey: ["floors", "with-tables"],
    queryFn: floorsApi.floorsWithTables,
    staleTime: 1000 * 60 * 5,
  });

  return {
    listFloorsQry: listFloorsQuery,
    useFloorById,
    floorsWithTablesQry: floorsWithTablesQuery,
  };
};
