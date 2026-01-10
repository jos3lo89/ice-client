import type {
  CreateOrderRequest,
  CreateOrderResponse,
  ListActiveOrdersResponse,
  GetOrderResponse,
  GetOrderByTableResponse,
  MyOrdersResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  CloseOrderRequest,
  CloseOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  OrderHistoryFilters,
  OrderHistoryResponse,
} from "@/types/orders.types";
import axiosI from "../axios";

export const ordersApi = {
  // Crear orden
  createOrder: async (values: CreateOrderRequest) => {
    const { data } = await axiosI.post<CreateOrderResponse>("/orders", values);
    return data;
  },

  // Listar órdenes activas
  listActiveOrders: async () => {
    const { data } = await axiosI.get<ListActiveOrdersResponse>("/orders");
    return data;
  },

  // Obtener orden por ID
  getOrderById: async (id: string) => {
    const { data } = await axiosI.get<GetOrderResponse>(`/orders/${id}`);
    return data;
  },

  // Orden activa de mesa
  getOrderByTable: async (tableId: string) => {
    const { data } = await axiosI.get<GetOrderByTableResponse>(
      `/orders/table/${tableId}`
    );
    return data;
  },

  // Mis órdenes activas
  getMyOrders: async () => {
    const { data } = await axiosI.get<MyOrdersResponse>("/orders/my-orders");
    return data;
  },

  // Actualizar orden
  updateOrder: async (id: string, values: UpdateOrderRequest) => {
    const { data } = await axiosI.patch<UpdateOrderResponse>(
      `/orders/${id}`,
      values
    );
    return data;
  },

  // Cerrar orden
  closeOrder: async (id: string, values?: CloseOrderRequest) => {
    const { data } = await axiosI.patch<CloseOrderResponse>(
      `/orders/${id}/close`,
      values
    );
    return data;
  },

  // Cancelar orden
  cancelOrder: async (id: string, values: CancelOrderRequest) => {
    const { data } = await axiosI.patch<CancelOrderResponse>(
      `/orders/${id}/cancel`,
      values
    );
    return data;
  },

  // Historial
  getOrderHistory: async (filters?: OrderHistoryFilters) => {
    const { data } = await axiosI.get<OrderHistoryResponse>("/orders/history", {
      params: filters,
    });
    return data;
  },
};
