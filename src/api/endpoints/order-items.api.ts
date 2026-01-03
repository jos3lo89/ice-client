import type {
  AddOrderItemRequest,
  AddOrderItemResponse,
  AddBulkOrderItemsRequest,
  AddBulkOrderItemsResponse,
  UpdateItemStatusRequest,
  UpdateItemStatusResponse,
  CancelOrderItemRequest,
  CancelOrderItemResponse,
  DeleteOrderItemResponse,
  SendToKitchenRequest,
  SendToKitchenResponse,
} from "@/types/orders.types";
import axiosI from "../axios";

export const orderItemsApi = {
  // Agregar item
  addItem: async (orderId: string, values: AddOrderItemRequest) => {
    const { data } = await axiosI.post<AddOrderItemResponse>(
      `/order-items/orders/${orderId}/items`,
      values,
    );
    return data;
  },

  // Agregar items en bulk
  addBulkItems: async (orderId: string, values: AddBulkOrderItemsRequest) => {
    const { data } = await axiosI.post<AddBulkOrderItemsResponse>(
      `/order-items/orders/${orderId}/items/bulk`,
      values,
    );
    return data;
  },

  // Actualizar estado de item
  updateItemStatus: async (itemId: string, values: UpdateItemStatusRequest) => {
    const { data } = await axiosI.patch<UpdateItemStatusResponse>(
      `/order-items/${itemId}/status`,
      values,
    );
    return data;
  },

  // Cancelar item
  cancelItem: async (itemId: string, values: CancelOrderItemRequest) => {
    const { data } = await axiosI.patch<CancelOrderItemResponse>(
      `/order-items/${itemId}/cancel`,
      values,
    );
    return data;
  },

  // Eliminar item
  deleteItem: async (itemId: string) => {
    const { data } = await axiosI.delete<DeleteOrderItemResponse>(
      `/order-items/${itemId}`,
    );
    return data;
  },

  // Enviar a cocina
  sendToKitchen: async (values: SendToKitchenRequest) => {
    const { data } = await axiosI.post<SendToKitchenResponse>(
      "/order-items/send-to-kitchen",
      values,
    );
    return data;
  },
};
