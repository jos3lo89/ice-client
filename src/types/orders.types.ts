// src/types/orders.types.ts

// ============================================
// ENUMS
// ============================================

export const OrderStatus = {
  ABIERTA: "ABIERTA",
  CERRADA: "CERRADA",
  PARCIALMENTE_PAGADA: "PARCIALMENTE_PAGADA",
  PAGADA: "PAGADA",
  CANCELADA: "CANCELADA",
  EN_PAGO_DIVIDIDO: "EN_PAGO_DIVIDIDO",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderItemStatus = {
  PENDIENTE: "PENDIENTE",
  ENVIADO: "ENVIADO",
  EN_PREPARACION: "EN_PREPARACION",
  LISTO: "LISTO",
  ENTREGADO: "ENTREGADO",
} as const;

export type OrderItemStatus =
  (typeof OrderItemStatus)[keyof typeof OrderItemStatus];

export const AreaPreparacion = {
  COCINA: "COCINA",
  BAR: "BAR",
  BEBIDAS: "BEBIDAS",
  CAJA: "CAJA",
} as const;

export type AreaPreparacion =
  (typeof AreaPreparacion)[keyof typeof AreaPreparacion];

// ============================================
// ENTITIES
// ============================================

export interface VariantSelection {
  group_name: string;
  option_name: string;
  price_modifier: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_short_name?: string;
  quantity: number;
  unit_price: number;
  variants_total: number;
  line_total: number;
  // variants_snapshot: VariantSelection[];
  variants_snapshot: string;
  status: OrderItemStatus;
  area_preparacion: AreaPreparacion;
  notes?: string;
  is_cancelled: boolean;
  is_paid: boolean;
  created_at: string;
  // TODO: ver aqui piner un enum
  sent_to_kitchen_at?: string;
  printed_at?: string;
  cancelled_at?: string;
  paid_at?: string;
}

export interface Order {
  id: string;
  daily_number: number;
  order_date: string;
  table: {
    id: string;
    number: number;
    name: string;
    capacity: number;
    floor_name: string;
  };
  diners_count: number;
  user: {
    id: string;
    name: string;
  };
  status: OrderStatus;
  subtotal: number;
  total_cancelled: number;
  total_paid: number;
  total_pending: number;
  is_split_payment: boolean;
  split_payment_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderListItem {
  id: string;
  daily_number: number;
  order_date: string;
  table_number: number;
  table_name: string;
  floor_name: string;
  diners_count: number;
  user_name: string;
  status: OrderStatus;
  subtotal: number;
  total_pending: number;
  is_split_payment: boolean;
  items_count: number;
  created_at: string;
  duration_hours: number;
  order_items: Array<{
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_short_name: string;
    quantity: number;
    unit_price: string;
    variants_snapshot: string;
    variants_total: string;
    line_total: string;
    status: string;
    area_preparacion: string;
    sent_to_kitchen_at?: string;
    printed_at: string | null;
    printer_id: string | null;
    notes?: string;
    is_cancelled: boolean;
    cancelled_at: string | null;
    cancelled_by: string | null;
    cancel_reason: string | null;
    is_paid: boolean;
    paid_at: string | null;
    payment_id: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  }>;
}

// ============================================
// API RESPONSES
// ============================================

// Crear orden
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    daily_number: number;
    order_date: string;
    table_number: number;
    table_name?: string;
    floor_name: string;
    diners_count: number;
    user: string;
    status: OrderStatus;
    created_at: string;
    message: string;
  };
}

// Listar órdenes activas
export interface ListActiveOrdersResponse {
  success: boolean;
  message: string;
  data: OrderListItem[];
}

// Obtener orden por ID
export interface GetOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Obtener orden activa de mesa
export interface GetOrderByTableResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Mis órdenes
export interface MyOrdersResponse {
  success: boolean;
  message: string;
  data: OrderListItem[];
}

// Actualizar orden
export interface UpdateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Cerrar orden
export interface CloseOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Cancelar orden
export interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Historial
export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: OrderListItem[];
}

// Agregar item
export interface AddOrderItemResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    product_name: string;
    product_short_name?: string;
    quantity: number;
    unit_price: number;
    variants_total: number;
    line_total: number;
    status: OrderItemStatus;
    area: AreaPreparacion;
    notes?: string;
    // variants_snapshot: VariantSelection[];
    variants_snapshot: string;
  };
  order_subtotal: number;
}

// Agregar items en bulk
export interface AddBulkOrderItemsResponse {
  success: boolean;
  items_added: number;
  items: AddOrderItemResponse["data"][];
  order_subtotal: number;
}

// Enviar a cocina
export interface SendToKitchenResponse {
  success: boolean;
  data: {
    sent_count: number;
    print_jobs: {
      printer: string;
      area: string;
      items_count: number;
      status: string;
    }[];
    message: string;
  };
}

// Cancelar item
export interface CancelOrderItemResponse {
  success: boolean;
  data: {
    id: string;
    is_cancelled: boolean;
    cancelled_at: string;
    cancelled_by: string;
    cancel_reason: string;
    order_subtotal: number;
  };
}

// Eliminar item
export interface DeleteOrderItemResponse {
  success: boolean;
  message: string;
  order_subtotal: number;
}

// Actualizar estado de item
export interface UpdateItemStatusResponse {
  success: boolean;
  id: string;
  status: OrderItemStatus;
  message: string;
}

// ============================================
// API REQUESTS
// ============================================

// Crear orden
export interface CreateOrderRequest {
  table_id: string;
  diners_count: number;
  notes?: string;
}

// Actualizar orden
export interface UpdateOrderRequest {
  table_id?: string;
  diners_count?: number;
  notes?: string;
}

// Cerrar orden
export interface CloseOrderRequest {
  notes?: string;
}

// Cancelar orden
export interface CancelOrderRequest {
  reason: string;
}

// Filtros historial
export interface OrderHistoryFilters {
  from?: string;
  to?: string;
  user_id?: string;
  status?: OrderStatus;
  table_id?: string;
}

// Agregar item
export interface AddOrderItemRequest {
  product_id: string;
  quantity: number;
  notes?: string;
  // variants?: VariantSelection[];
  variants?: string;
}

// Agregar items en bulk
export interface AddBulkOrderItemsRequest {
  items: AddOrderItemRequest[];
}

// Cancelar item
export interface CancelOrderItemRequest {
  reason: string;
}

// Actualizar estado de item
export interface UpdateItemStatusRequest {
  status: OrderItemStatus;
}

// Enviar a cocina
export interface SendToKitchenRequest {
  order_id: string;
  item_ids: string[];
}

// export interface SendToKitchenRequest {
//   order_id: string;
//   items: OrderItem[];
// }
