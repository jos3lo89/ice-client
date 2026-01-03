import { tablesApi } from "@/api/endpoints/tables.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  CreateTableRequest,
  ChangeTableStatusRequest,
} from "@/types/table.types";

export const queryKeys = {
  tables: ["tables"] as const,
  tablesPerFloor: (floorId: string) => ["tables", "floor", floorId] as const,
  freeTables: ["tables", "free"] as const,
  floors: ["floors"] as const,
  floor: (floorId: string) => ["floors", floorId] as const,
};

export const useTables = () => {
  const queryClient = useQueryClient();

  const listTablesQuery = useQuery({
    queryKey: ["tables"],
    queryFn: tablesApi.listTables,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
  });

  const useTablesPerFloor = (floorId: string) => {
    return useQuery({
      queryKey: ["tables", "floor", floorId],
      queryFn: () => tablesApi.tablesPerFloor(floorId),
      enabled: !!floorId,
      staleTime: 1000 * 15,
      refetchInterval: 1000 * 15,
    });
  };

  // Mesas libres
  // const freeTablesQuery = useQuery({
  //   queryKey: queryKeys.freeTables,
  //   queryFn: tablesApi.freeTables,
  //   staleTime: 1000 * 30,
  // });

  // Crear mesa
  const createTableMutation = useMutation({
    mutationFn: (values: CreateTableRequest) => tablesApi.createTable(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tablesPerFloor(data.data.floor_id),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al crear mesa", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Cambiar estado de mesa
  const changeTableStatusMutation = useMutation({
    mutationFn: ({
      tableId,
      status,
    }: {
      tableId: string;
      status: ChangeTableStatusRequest;
    }) => tablesApi.changeTableStatus(tableId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tablesPerFloor(data.data.floor_id),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al cambiar estado", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Eliminar mesa
  const deleteTableMutation = useMutation({
    mutationFn: (tableId: string) => tablesApi.deleteTable(tableId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al eliminar mesa", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  return {
    // Queries
    listTablesQry: listTablesQuery,
    useTablesPerFloor,
    // freeTablesQuery,

    // Mutations
    createTable: createTableMutation,
    changeTableStatus: changeTableStatusMutation,
    deleteTable: deleteTableMutation,
  };
};
