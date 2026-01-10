import { ordersApi } from "@/api/endpoints/orders.api";
import { orderItemsApi } from "@/api/endpoints/order-items.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  CloseOrderRequest,
  CancelOrderRequest,
  OrderHistoryFilters,
  AddOrderItemRequest,
  AddBulkOrderItemsRequest,
  UpdateItemStatusRequest,
  CancelOrderItemRequest,
  SendToKitchenRequest,
} from "@/types/orders.types";

export const queryKeys = {
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
  orderByTable: (tableId: string) => ["orders", "table", tableId] as const,
  myOrders: ["orders", "my-orders"] as const,
  orderHistory: (filters?: OrderHistoryFilters) =>
    ["orders", "history", filters] as const,
};

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Listar órdenes activas
  const listActiveOrdersQuery = useQuery({
    queryKey: queryKeys.orders,
    queryFn: ordersApi.listActiveOrders,
    staleTime: 1000 * 15,
  });

  // Obtener orden por ID
  const useOrderById = (id: string) => {
    return useQuery({
      queryKey: ["orders", id],
      queryFn: () => ordersApi.getOrderById(id),
      enabled: !!id,
      staleTime: 1000 * 10,
      refetchInterval: 1000 * 15,
    });
  };

  // Orden activa de mesa
  const useOrderByTable = (tableId: string) => {
    return useQuery({
      queryKey: queryKeys.orderByTable(tableId),
      queryFn: () => ordersApi.getOrderByTable(tableId),
      enabled: !!tableId,
      staleTime: 1000 * 10,
      retry: false, // No reintentar si no hay orden activa
    });
  };

  // Mis órdenes
  const myOrdersQuery = useQuery({
    queryKey: queryKeys.myOrders,
    queryFn: ordersApi.getMyOrders,
    staleTime: 1000 * 15,
  });

  // Crear orden
  const createOrderMutation = useMutation({
    mutationFn: (values: CreateOrderRequest) => ordersApi.createOrder(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors", "with-tables"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Error al crear orden", {
          description: error.response?.data?.message || "Intenta nuevamente",
        });
      } else {
        toast.error("Error al crear orden", {
          description: "Intenta nuevamente",
        });
      }
    },
  });

  // Actualizar orden
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateOrderRequest }) =>
      ordersApi.updateOrder(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.id),
      });
      toast.success("Orden actualizada");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al actualizar orden", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Cerrar orden
  const closeOrderMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values?: CloseOrderRequest }) =>
      ordersApi.closeOrder(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.id),
      });
      toast.success("Orden cerrada");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al cerrar orden", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // TODO: verficar funcionamiento
  // Cancelar orden
  const cancelOrderMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CancelOrderRequest }) =>
      ordersApi.cancelOrder(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });

      toast.success("Orden cancelada");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Error al cancelar orden", {
          description: error.response?.data.message,
        });
      } else {
        toast.error("Error al cancelar orden", {
          description: "Intenta nuevamente",
        });
      }
    },
  });

  // Agregar item
  const addItemMutation = useMutation({
    mutationFn: ({
      orderId,
      values,
    }: {
      orderId: string;
      values: AddOrderItemRequest;
    }) => orderItemsApi.addItem(orderId, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al agregar item", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Agregar items en bulk
  const addBulkItemsMutation = useMutation({
    mutationFn: ({
      orderId,
      values,
    }: {
      orderId: string;
      values: AddBulkOrderItemsRequest;
    }) => orderItemsApi.addBulkItems(orderId, values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success(`${data.items_added} items agregados`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al agregar items", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Enviar a cocina
  const sendToKitchenMutation = useMutation({
    mutationFn: (values: SendToKitchenRequest) =>
      orderItemsApi.sendToKitchen(values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.order_id),
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al enviar a cocina", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Cancelar item
  const cancelItemMutation = useMutation({
    mutationFn: ({
      itemId,
      values,
    }: {
      itemId: string;
      values: CancelOrderItemRequest;
      orderId: string;
    }) => orderItemsApi.cancelItem(itemId, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al cancelar item", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Eliminar item
  const deleteItemMutation = useMutation({
    mutationFn: ({ itemId }: { itemId: string; orderId: string }) =>
      orderItemsApi.deleteItem(itemId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Error al eliminar item", {
          description: error.response?.data.message,
        });
      } else {
        toast.error("Error al eliminar item", {
          description: "Intenta nuevamente",
        });
      }
    },
  });

  // Actualizar estado de item
  const updateItemStatusMutation = useMutation({
    mutationFn: ({
      itemId,
      values,
    }: {
      itemId: string;
      values: UpdateItemStatusRequest;
      orderId: string;
    }) => orderItemsApi.updateItemStatus(itemId, values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.order(variables.orderId),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al actualizar estado", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  return {
    // Queries
    listActiveOrdersQuery,
    useOrderById,
    useOrderByTable,
    myOrdersQuery,

    // Mutations
    createOrder: createOrderMutation,
    updateOrder: updateOrderMutation,
    closeOrder: closeOrderMutation,
    cancelOrder: cancelOrderMutation,
    addItem: addItemMutation,
    addBulkItems: addBulkItemsMutation,
    sendToKitchen: sendToKitchenMutation,
    cancelItem: cancelItemMutation,
    deleteItem: deleteItemMutation,
    updateItemStatus: updateItemStatusMutation,
  };
};
