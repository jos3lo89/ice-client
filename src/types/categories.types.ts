// crear categoria
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  default_area: string;
  display_order: number;
  icon: string;
  color: string;
  image_path: string;
  is_active: boolean;
}

export interface CreateCategoryResponse {
  succes: boolean;
  message: string;
  data: CreateCategoryData;
}

export interface CreateCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: any;
  level: number;
  default_area: string;
  display_order: number;
  icon: string;
  color: string;
  image_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent: any;
}

// listar todas las categorias
export interface ListCategoriesResponse {
  succes: boolean;
  message: string;
  data: ListCategoriesData[];
}

export interface ListCategoriesData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  level: number;
  default_area: string;
  display_order: number;
  icon?: string;
  color?: string;
  image_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count: ListCategoriesCount;
  children: ListCategoriesChildren[];
  productsCount: number;
}

export interface ListCategoriesCount {
  products: number;
}

export interface ListCategoriesChildren {
  id: string;
  name: string;
  slug: string;
  description?: string;
  default_area: string;
  display_order: number;
  icon?: string;
  color?: string;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent_id: string;
  image_path: any;
}

// arbol jerarquico de categorias
export interface HierarchicalTreeOfCategoriesResponse {
  succes: boolean;
  message: string;
  data: HierarchicalTreeOfCategoriesData[];
}

export interface HierarchicalTreeOfCategoriesData {
  id: string;
  name: string;
  slug: string;
  default_area: string;
  productsCount: number;
  icon?: string;
  color: string;
  display_order: number;
  children: Children[];
}

export interface Children {
  id: string;
  name: string;
  slug: string;
  default_area: string;
  productsCount: number;
  icon?: string;
  color?: string;
  display_order: number;
  children: any[];
}

// buscar por slug
export interface SearchForSlugResponse {
  succes: boolean;
  message: string;
  data: SearchForSlugData;
}

export interface SearchForSlugData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string;
  level: number;
  default_area: string;
  display_order: number;
  icon: string | null;
  color: string | null;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count: Count;
  products: Product[];
  productsCount: number;
}

export interface Count {
  products: number;
}

export interface Product {
  id: string;
  name: string;
  short_name: string;
  price: string;
  is_available: boolean;
  is_featured: boolean;
  image_path: string;
  display_order: number;
}

// buscar por id
export interface SearchForIdResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  level: number;
  default_area: string;
  display_order: number;
  icon: string | null;
  color: string | null;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count: Count;
  products: Product[];
  productsCount: number;
}

// actualizar categoria
export interface UpdateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  default_area: string;
  display_order: number;
  icon: string | null;
  color: string | null;
  image_path: string | null;
  is_active: boolean;
}

export interface UpdateCategoryResponse {
  succes: boolean;
  message: string;
  data: UpdateCategoryData;
}

export interface UpdateCategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  level: number;
  default_area: string;
  display_order: number;
  icon: string | null;
  color: string | null;
  image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// desactivar categoria
export interface DeactivateCategoryResponse {
  succes: boolean;
  message: string;
  data: null;
}
