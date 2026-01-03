import type {
  CreateFloorRequest,
  CreateFloorResponse,
  DeactivateFloorResponse,
  DetailsFloorResponse,
  FloorsWithTablesResponse,
  ListFloorsResponse,
  UpdateFloorRequest,
  UpdateFloorResponse,
} from "@/types/floor.type";
import axiosI from "../axios";

export const floorsApi = {
  createFloor: async (floor: CreateFloorRequest) => {
    const { data } = await axiosI.post<CreateFloorResponse>("/floors", floor);
    return data;
  },

  listFloors: async () => {
    const { data } = await axiosI.get<ListFloorsResponse>("/floors");
    return data;
  },

  detailsFloor: async (floorId: string) => {
    const { data } = await axiosI.get<DetailsFloorResponse>(
      `/floors/${floorId}`,
    );
    return data;
  },

  updateFloor: async (floorId: string, floor: UpdateFloorRequest) => {
    const { data } = await axiosI.patch<UpdateFloorResponse>(
      `/floors/${floorId}`,
      floor,
    );
    return data;
  },
  deactivateFloor: async (floorId: string) => {
    const { data } = await axiosI.delete<DeactivateFloorResponse>(
      `/floors/${floorId}`,
    );
    return data;
  },
  floorsWithTables: async () => {
    const { data } =
      await axiosI.get<FloorsWithTablesResponse>("/floors/tables");
    return data;
  },
};
