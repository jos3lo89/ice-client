export interface RequestClientsResponse {
  success: boolean;
  message: string;
  data: ClientI[];
}

export interface ClientI {
  id: string;
  tipo_documento: string;
  numero_documento: string;
  razon_social: string;
  nombre_comercial: string | null;
  direccion: string | null;
  ubigeo: string | null;
  email: string | null;
  telefono: string | null;
  total_purchases: number;
  visit_count: number;
  last_visit_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
