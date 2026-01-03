// crear un piso
export interface CreateFloorRequest {
  name: string;
  level: number;
  description: string;
}

export interface CreateFloorResponse {
  success: boolean;
  data: CreateFloor;
  message: string;
}

export interface CreateFloor {
  id: string;
  name: string;
  level: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// listar todos los pisos
export interface ListFloorsResponse {
  success: boolean;
  data: ListFloors[];
}

export interface ListFloors {
  id: string;
  name: string;
  level: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count: CountTables;
}

export interface CountTables {
  tables: number;
}

// detalles por piso
export interface DetailsFloorResponse {
  success: boolean;
  data: DetailsFloor;
}

export interface DetailsFloor {
  id: string;
  name: string;
  level: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tables: DetailsFloorTable[];
}

export interface DetailsFloorTable {
  id: string;
  floor_id: string;
  number: number;
  name: string;
  capacity: number;
  status: string;
  pos_x: number;
  pos_y: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// actualizar un piso
export interface UpdateFloorRequest {
  name?: string;
  level?: number;
  description?: string;
}

export interface UpdateFloorResponse {
  success: boolean;
  data: UpdateFloor;
  message: string;
}

export interface UpdateFloor {
  id: string;
  name: string;
  level: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// desactivar un piso
export interface DeactivateFloorResponse {
  success: boolean;
  message: string;
}

// pisos con mesas
export interface FloorsWithTablesResponse {
  success: boolean;
  message: string;
  data: ListFloorsWithTables[];
}

export interface ListFloorsWithTables {
  id: string;
  level: number;
  name: string;
  _count: {
    tables: number;
  };
  tables: Table[];
}

export const TableStatus = {
  LIBRE: "LIBRE",
  OCUPADA: "OCUPADA",
  RESERVADA: "RESERVADA",
  LIMPIEZA: "LIMPIEZA",
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

export interface Table {
  orders: Order[];
  id: string;
  name: string;
  number: number;
  capacity: number;
  status: TableStatus;
  _count: {
    orders: number;
  };
}

export const OrderStatus = {
  ABIERTA: "ABIERTA",
  CERRADA: "CERRADA",
  PARCIALMENTE_PAGADA: "PARCIALMENTE_PAGADA",
  PAGADA: "PAGADA",
  CANCELADA: "CANCELADA",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id: string;
  daily_number: number;
  subtotal: number;
  status: OrderStatus;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
}
