import type {
  ChangeTableStatusRequest,
  ChangeTableStatusResponse,
  CreateTableRequest,
  CreateTableResponse,
  DeleteTableResponse,
  FreeTablesResponse,
  ListTablesPerFloorResponse,
  ListTablesResponse,
} from "@/types/table.types";
import axiosI from "../axios";

export const tablesApi = {
  createTable: async (values: CreateTableRequest) => {
    const { data } = await axiosI.post<CreateTableResponse>("/tables", values);
    return data;
  },

  listTables: async () => {
    const { data } = await axiosI.get<ListTablesResponse>("/tables");
    return data;
  },

  tablesPerFloor: async (floorId: string) => {
    const { data } = await axiosI.get<ListTablesPerFloorResponse>(
      `/tables/floor/${floorId}`,
    );

    return data;
  },

  freeTables: async () => {
    const { data } = await axiosI.get<FreeTablesResponse>("/tables/available");
    return data;
  },

  changeTableStatus: async (
    tableId: string,
    status: ChangeTableStatusRequest,
  ) => {
    const { data } = await axiosI.patch<ChangeTableStatusResponse>(
      `/tables/${tableId}/status`,
      { status },
    );
    return data;
  },
  deleteTable: async (tableId: string) => {
    const { data } = await axiosI.delete<DeleteTableResponse>(
      `/tables/${tableId}`,
    );
    return data;
  },
};
