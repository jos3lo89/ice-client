// ============================================
// ENUMS
// ============================================

// Estado de la Caja Registradora
export const CashRegisterStatus = {
  ABIERTA: "ABIERTA",
  CERRADA: "CERRADA",
} as const;

export type CashRegisterStatus =
  (typeof CashRegisterStatus)[keyof typeof CashRegisterStatus];

// Tipo de Movimiento (Caja)

export const CashMovementType = {
  INGRESO: "INGRESO",
  EGRESO: "EGRESO",
} as const;

export type MovementType =
  (typeof CashMovementType)[keyof typeof CashMovementType];

// Tipo de Diferencia (Arqueo)
export const DifferenceType = {
  CUADRADO: "CUADRADO",
  SOBRANTE: "SOBRANTE",
  FALTANTE: "FALTANTE",
} as const;

export type DifferenceType =
  (typeof DifferenceType)[keyof typeof DifferenceType];

// ============================================
// ENTITIES
// ============================================

export interface CashRegister {
  id: string;
  user_id: string;
  open_time: string;
  close_time?: string;
  initial_amount: number;
  final_amount?: number;
  status: CashRegisterStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
  };
}

export interface CashMovement {
  id: string;
  type: MovementType;
  amount: number;
  description: string;
  is_automatic: boolean;
  created_by: string;
  created_at: string;
  // TODO: ver en componeten que no se rederice algun dato
  // cash_register_id: string;
  // amount: number;
  // description: string;
  // is_automatic: boolean;
  // created_by?: string;
  // created_at: string;
  // creator?: {
  //   name: string;
  // };
}

export interface CashRegisterSummary {
  id: string;
  user: string;
  period: {
    open: string;
    close?: string;
    duration_hours: number;
  };
  amounts: {
    initial: number;
    final?: number;
    expected: number;
    difference: number;
  };
  sales_summary: {
    total_count: number;
    total_amount: number;
    by_type: Record<string, { count: number; amount: number }>;
    by_payment_method: Record<string, { count: number; amount: number }>;
  };
  movements: {
    income: { count: number; amount: number };
    expense: { count: number; amount: number };
  };
}

// ============================================
// API RESPONSES
// ============================================

// Abrir caja
export interface OpenCashRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    open_time: string;
    close_time: string | null;
    initial_amount: number;
    status: CashRegisterStatus;
    total_sales: number;
    total_income: number;
    total_expense: number;
    expected_amount: number;
    notes: string;
    created_at: string;
    updated_at: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
  };
}

// Cerrar caja
export interface CloseCashRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    user: {
      name: string;
    };
    period: {
      open: string;
      close: string;
      duration_hours: number;
    };
    amounts: {
      initial: number;
      expected: number;
      final: number;
      difference: number;
    };
    sales_summary: {
      total_count: number;
      total_amount: number;
      by_type: any; // TODO: revisar luego
      by_payment_method: any; // TODO: revisar leugo
    };
    movements: {
      income: {
        count: number;
        amount: number;
      };
      expense: {
        count: number;
        amount: number;
      };
    };
    open_time: string;
    close_time: string;
    initial_amount: number;
    final_amount: number;

    // summary: {
    //   total_sales: number;
    //   total_income: number;
    //   total_expense: number;
    //   expected_amount: number;
    //   difference: number;
    //   difference_type: DifferenceType;
    // };
    // sales_count: number;
    // movements_count: number;
    // by_payment_method: Record<string, number>;
  };
}

// caja actual - probada
export interface CurrentCashRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    open_time: string;
    initial_amount: number;
    status: CashRegisterStatus;
    hours_open: number;
    sales_count: number;
    totals: {
      sales: number;
      income: number;
      expense: number;
      current_balance: number;
    };
  };
}

// TODO: revisar desde aqui para abajo

// Resumen de caja
export interface CashRegisterSummaryResponse {
  success: boolean;
  data: CashRegisterSummary;
}

// Cajas del día
export interface TodayCashRegistersResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    user_name: string;
    open_time: string;
    close_time: string | null;
    initial_amount: number;
    expected_amount: number;
    sales_count: number;
    total_sales: number;
    final_amount: number | null;
    difference: number;
    // user: string;
    status: CashRegisterStatus;
    current_balance: number;
  }>;
}

// Crear movimiento
export interface CreateCashMovementResponse {
  success: boolean;
  data: {
    id: string;
    type: MovementType;
    amount: number;
    description: string;
    is_automatic: boolean;
    created_by: string;
    created_at: string;
    new_balance: number;
  };
}

// Listar movimientos
export interface ListCashMovementsResponse {
  success: boolean;
  message: string;
  data: CashMovement[];
}

// ============================================
// API REQUESTS
// ============================================

// Abrir caja
export interface OpenCashRegisterRequest {
  initial_amount: number;
  notes?: string;
}

// Cerrar caja
export interface CloseCashRegisterRequest {
  final_amount: number;
  notes?: string;
}

// Crear movimiento
export interface CreateCashMovementRequest {
  type: MovementType;
  amount: number;
  description: string;
}

// --------

export interface Sale {
  id: string;
  numero_completo: string;
  tipo_comprobante: "TICKET" | "BOLETA" | "FACTURA";
  payment_method: string;
  precio_venta_total: number;
  client_name?: string;
  created_at: string;
}

export interface ListSalesResponse {
  success: boolean;
  message: string;
  data: Sale[];
}
