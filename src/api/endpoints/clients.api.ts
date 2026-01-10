import type { RequestClientsResponse } from "@/types/clients.type";
import axiosI from "../axios";

export const clientsApi = {
  getAllClients: async () => {
    const { data } = await axiosI.get<RequestClientsResponse>("/clients");
    return data;
  },
};
