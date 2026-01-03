export const TableStatus = {
  LIBRE: "LIBRE",
  OCUPADA: "OCUPADA",
  RESERVADA: "RESERVADA",
  LIMPIEZA: "LIMPIEZA",
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

// crear una mesa
export interface CreateTableRequest {
  floor_id: string;
  number: number;
  name: string;
  capacity: number;
  pos_x: number;
  pos_y: number;
}

export interface CreateTableResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
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

// listar todas las mesas
export interface ListTablesResponse {
  success: boolean;
  message: string;
  data: Tables[];
}

export interface Tables {
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
  floor: Floor;
  orders: any[]; // TODO: definir tipo
}

export interface Floor {
  name: string;
  id: string;
  level: number;
}

// listar todas las mesas por piso
export interface ListTablesPerFloorResponse {
  success: boolean;
  message: string;
  data: TablesPerFloor[];
}

export interface TablesPerFloor {
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
  orders: any[]; // TODO: definir tipo
}

// mesas libres
export interface FreeTablesResponse {
  success: boolean;
  message: string;
  data: Tables[];
}

// cambiar el estado de una mesa
export interface ChangeTableStatusRequest {
  status: string;
}
export interface ChangeTableStatusResponse {
  success: boolean;
  message: string;
  data: Tables;
}

// eliminar una mesa

export interface DeleteTableResponse {
  success: boolean;
  message: string;
  data: DeleteTable;
}

export interface DeleteTable {
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
