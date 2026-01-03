// src/types/products.types.ts

// ============================================
// ENUMS
// ============================================

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

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VariantOption {
  id: string;
  variant_group_id: string;
  name: string;
  price_modifier: number;
  is_default: boolean;
  is_active: boolean;
  display_order: number;
}

export interface VariantGroup {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  max_selections: number;
  display_order: number;
  options: VariantOption[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  short_name?: string;
  description?: string;
  price: number;
  cost: number;
  unidad_medida: string;
  codigo_producto?: string;
  aplica_icbper: boolean;
  area_preparacion: AreaPreparacion;
  is_stock_managed: boolean;
  stock_actual: number;
  stock_minimo: number;
  image_path?: string;
  display_order: number;
  is_available: boolean;
  is_active: boolean;
  is_featured: boolean;
  category: Category;
  variant_groups: VariantGroup[];
  has_variants: boolean;
}

// ============================================
// API RESPONSES
// ============================================

// Listar productos
export interface ListProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Obtener producto por ID
export interface ProductByIdResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Productos por categoría
export interface ProductsByCategoryResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Productos por área
export interface ProductsByAreaResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Productos destacados
export interface FeaturedProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

// Crear producto
export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Actualizar producto
export interface UpdateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Toggle state (activar/desactivar)
export interface ToggleStateResponse {
  success: boolean;
  message: string;
  data: null;
}

// Ajustar stock
export interface AdjustStockResponse {
  success: boolean;
  message: string;
  data: {
    product_id: string;
    product_name: string;
    previous_stock: number;
    new_stock: number;
    adjustment: number;
    reason: string;
    adjusted_at: string;
  };
}

// Toggle availability
export interface ToggleAvailabilityResponse {
  id: string;
  category_id: string;
  name: string;
  short_name?: string;
  description?: string;
  price: number;
  cost: number;
  unidad_medida: string;
  codigo_producto?: string;
  aplica_icbper: boolean;
  area_preparacion: AreaPreparacion;
  is_stock_managed: boolean;
  stock_actual: number;
  stock_minimo: number;
  image_path?: string;
  display_order: number;
  is_available: boolean;
  is_active: boolean;
  is_featured: boolean;
}

// Agregar grupo de variantes
export interface AddVariantGroupResponse {
  success: boolean;
  message: string;
  data: Product;
}

// Eliminar grupo de variantes
export interface RemoveVariantGroupResponse {
  success: boolean;
  message: string;
  data: Product;
}

// ============================================
// API REQUESTS
// ============================================

// Crear opción de variante
export interface CreateVariantOptionRequest {
  name: string;
  price_modifier: number;
  is_default?: boolean;
  is_active?: boolean;
  display_order?: number;
}

// Crear grupo de variantes
export interface CreateVariantGroupRequest {
  name: string;
  is_required?: boolean;
  max_selections: number;
  display_order?: number;
  options: CreateVariantOptionRequest[];
}

// Crear producto
export interface CreateProductRequest {
  category_id: string;
  name: string;
  short_name?: string;
  description?: string;
  price: number;
  cost?: number;
  area_preparacion: AreaPreparacion;
  unidad_medida?: string;
  codigo_producto?: string;
  afectacion_igv?: string;
  aplica_icbper?: boolean;
  is_stock_managed?: boolean;
  stock_actual?: number;
  stock_minimo?: number;
  image_path?: string;
  display_order?: number;
  is_available?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  variant_groups?: CreateVariantGroupRequest[];
}

// Actualizar producto
export interface UpdateProductRequest {
  category_id?: string;
  name?: string;
  short_name?: string;
  description?: string;
  price?: number;
  cost?: number;
  area_preparacion?: AreaPreparacion;
  unidad_medida?: string;
  codigo_producto?: string;
  afectacion_igv?: string;
  aplica_icbper?: boolean;
  is_stock_managed?: boolean;
  stock_actual?: number;
  stock_minimo?: number;
  image_path?: string;
  display_order?: number;
  is_available?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
}

// Ajustar stock
export interface AdjustStockRequest {
  quantity: number;
  reason?: string;
}

// Toggle availability
export interface ToggleAvailabilityRequest {
  is_available: boolean;
  reason?: string;
}

// Agregar grupo de variantes
export interface AddVariantGroupRequest {
  name: string;
  is_required?: boolean;
  max_selections: number;
  display_order?: number;
  options: CreateVariantOptionRequest[];
}
