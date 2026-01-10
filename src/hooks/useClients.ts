import { clientsApi } from "@/api/endpoints/clients.api";
import { useQuery } from "@tanstack/react-query";

export const useClients = () => {
  const listClients = useQuery({
    queryKey: ["clients", "list"],
    queryFn: clientsApi.getAllClients,
    staleTime: 1000 * 60 * 5,
  });

  return {
    listClientsrQry: listClients,
  };
};
