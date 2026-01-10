// ============================================
// INCREMENTAL PAYMENT TYPES
// ============================================

export interface ItemAllocation {
  item_id: string;
  quantity: number;
  amount: number;
}

export interface IncrementalPaymentItem {
  payer_name: string;
  payment_method: PaymentMethodT;
  amount: number;
  amount_received?: number;
  generate_document: boolean;
  document_type: ComprobanteTypeT;
  client_id?: string;
  payer_notes?: string;
  item_allocations: ItemAllocation[];
}

export interface IncrementalPaymentRequest {
  order_id: string;
  payments: IncrementalPaymentItem[];
}

export interface IncrementalPaymentResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: string;
      status: string;
      total_paid: number;
      total_pending: number;
      is_split_payment: boolean;
      split_payment_count: number;
    };
    table: {
      id: string;
      new_status: string;
    };
    payments: Array<{
      payment_number: number;
      payer_name: string;
      amount: number;
      change_given?: number;
      items_paid: number;
      sale_number?: string;
    }>;
  };
}

// Para progreso de pagos
export interface PaymentProgressItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  quantity_paid: number;
  amount_paid: number;
  remaining_quantity: number;
  remaining_amount: number;
  is_fully_paid: boolean;
  payment_percentage: number;
}

export interface PaymentProgressResponse {
  success: boolean;
  data: {
    order_id: string;
    status: string;
    subtotal: number;
    total_amount: number;
    total_paid: number;
    total_pending: number;
    payment_percentage: number;
    is_split_payment: boolean;
    split_payment_count: number;
    items: Array<{
      id: string;
      product_name: string;
      quantity: number;
      quantity_paid: number;
      amount: number;
      amount_paid: number;
      remaining_amount: number;
      is_fully_paid: boolean;
      payments: any[];
    }>;
    payments_history: any[];
    // totals: {
    //   subtotal: number;
    //   total_paid: number;
    //   total_pending: number;
    //   payment_percentage: number;
    // };
  };
}

// ============================================
// ENUMS
// ============================================

// Métodos de Pago
export const PaymentMethod = {
  EFECTIVO: "EFECTIVO",
  YAPE: "YAPE",
  PLIN: "PLIN",
  TRANSFERENCIA: "TRANSFERENCIA",
  TARJETA_VISA: "TARJETA_VISA",
  TARJETA_MASTERCARD: "TARJETA_MASTERCARD",
  TARJETA_AMEX: "TARJETA_AMEX",
} as const;

export type PaymentMethodT = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Tipos de Comprobante
export const ComprobanteType = {
  TICKET: "TICKET",
  BOLETA: "BOLETA",
  FACTURA: "FACTURA",
} as const;

export type ComprobanteTypeT =
  (typeof ComprobanteType)[keyof typeof ComprobanteType];

// Estados de envío a SUNAT
export const EstadoSunat = {
  PENDIENTE: "PENDIENTE",
  ACEPTADO: "ACEPTADO",
  RECHAZADO: "RECHAZADO",
  ERROR: "ERROR",
  NO_APLICA: "NO_APLICA",
  ENVIANDO: "ENVIANDO",
  OBSERVADO: "OBSERVADO",
  ANULADO: "ANULADO",
} as const;

export type EstadoSunatT = (typeof EstadoSunat)[keyof typeof EstadoSunat];

// ============================================
// ENTITIES
// ============================================

export interface Payment {
  id: string;
  order_id: string;
  cash_register_id: string;
  payment_number: number;
  payment_method: PaymentMethodT;
  amount: number;
  amount_received?: number;
  change_given?: number;
  payer_name?: string;
  created_by: string;
  created_at: string;
}

export interface Sale {
  id: string;
  order_id: string;
  payment_id: string;
  cash_register_id: string;
  client_id?: string;
  tipo_comprobante: ComprobanteTypeT;
  serie: string;
  correlativo: number;
  numero_completo: string;
  fecha_emision: string;
  subtotal: number;
  total_descuentos: number;
  total_icbper: number;
  total_igv: number;
  precio_venta_total: number;
  estado_sunat: EstadoSunatT;
  hash_cpe?: string;
  codigo_sunat?: string;
  descripcion_sunat?: string;
  xml_base64?: string;
  created_at: string;
}

// ============================================
// API RESPONSES
// ============================================

// Procesar pago
export interface ProcessPaymentResponse {
  success: boolean;
  message: string;
  data: null;
  // data: {
  //   payment: {
  //     id: string;
  //     payment_number: number;
  //     amount: number;
  //     payment_method: PaymentMethodT;
  //     amount_received?: number;
  //     change_given?: number;
  //   };
  //   sale: {
  //     id: string;
  //     tipo_comprobante: ComprobanteTypeT;
  //     numero_completo: string;
  //     precio_venta_total: number;
  //     monto_igv: number;
  //   };
  //   order: {
  //     id: string;
  //     status: string;
  //     total_paid: number;
  //     total_pending: number;
  //   };
  //   table: {
  //     id: string;
  //     new_status: string;
  //   };
  // };
}

// Pago dividido
export interface SplitPaymentResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: string;
      status: string;
      is_split_payment: boolean;
      split_payment_count: number;
    };
    payments: Array<{
      payment_number: number;
      payer_name: string;
      amount: number;
      change_given?: number;
      sale_number: string;
    }>;
  };
}

// Pagos de orden
export interface OrderPaymentsResponse {
  success: boolean;
  data: Payment[];
}

// Detalle de pago
export interface PaymentDetailResponse {
  success: boolean;
  data: {
    payment: Payment;
    sale?: Sale;
    order: {
      id: string;
      daily_number: number;
      table_number: number;
    };
  };
}

// ============================================
// API REQUESTS
// ============================================

// Procesar pago simple
export interface ProcessPaymentRequest {
  order_id: string;
  payment_method: PaymentMethodT;
  amount: number;
  amount_received?: number;
  generate_document: boolean;
  document_type: ComprobanteTypeT;
  client_id?: string;
  payer_notes?: string;
}

// Item de pago dividido
export interface SplitPaymentItem {
  payer_name: string;
  payment_method: PaymentMethodT;
  amount: number;
  amount_received?: number;
  item_ids: string[];
  generate_document: boolean;
  document_type: ComprobanteTypeT;
  client_id?: string;
}

// Procesar pago dividido
export interface SplitPaymentRequest {
  order_id: string;
  payments: SplitPaymentItem[];
}
