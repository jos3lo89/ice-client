import type {
  AddVariantGroupRequest,
  AddVariantGroupResponse,
  AdjustStockRequest,
  AdjustStockResponse,
  CreateProductRequest,
  CreateProductResponse,
  FeaturedProductsResponse,
  ListProductsResponse,
  ProductByIdResponse,
  ProductsByAreaResponse,
  ProductsByCategoryResponse,
  RemoveVariantGroupResponse,
  ToggleAvailabilityRequest,
  ToggleAvailabilityResponse,
  ToggleStateResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "@/types/products.types";
import axiosI from "../axios";

export const productsApi = {
  // Listar todos los productos
  listProducts: async () => {
    const { data } = await axiosI.get<ListProductsResponse>("/products");
    const { data: wadafa } = await axiosI.get("/products");
    console.log(wadafa);

    return data;
  },

  // Obtener producto por ID
  getProductById: async (id: string) => {
    const { data } = await axiosI.get<ProductByIdResponse>(`/products/${id}`);
    return data;
  },

  // Productos por categoría
  getProductsByCategory: async (categoryId: string) => {
    const { data } = await axiosI.get<ProductsByCategoryResponse>(
      `/products/category/${categoryId}`,
    );
    return data;
  },

  // Productos por área de preparación
  getProductsByArea: async (area: string) => {
    const { data } = await axiosI.get<ProductsByAreaResponse>(
      `/products/area/${area}`,
    );
    return data;
  },

  // Productos destacados
  getFeaturedProducts: async () => {
    const { data } =
      await axiosI.get<FeaturedProductsResponse>("/products/featured");
    return data;
  },

  // Crear producto
  createProduct: async (values: CreateProductRequest) => {
    const { data } = await axiosI.post<CreateProductResponse>(
      "/products",
      values,
    );
    return data;
  },

  // Actualizar producto
  updateProduct: async (id: string, values: UpdateProductRequest) => {
    const { data } = await axiosI.patch<UpdateProductResponse>(
      `/products/${id}`,
      values,
    );
    return data;
  },

  // Desactivar producto
  deactivateProduct: async (id: string) => {
    const { data } = await axiosI.delete<ToggleStateResponse>(
      `/products/${id}/deactivate`,
    );
    return data;
  },

  // Activar producto
  activateProduct: async (id: string) => {
    const { data } = await axiosI.delete<ToggleStateResponse>(
      `/products/${id}/activate`,
    );
    return data;
  },

  // Ajustar stock
  adjustStock: async (id: string, values: AdjustStockRequest) => {
    const { data } = await axiosI.patch<AdjustStockResponse>(
      `/products/${id}/stock`,
      values,
    );
    return data;
  },

  // Cambiar disponibilidad
  toggleAvailability: async (id: string, values: ToggleAvailabilityRequest) => {
    const { data } = await axiosI.patch<ToggleAvailabilityResponse>(
      `/products/${id}/toggle-availability`,
      values,
    );
    return data;
  },

  // Agregar grupo de variantes
  addVariantGroup: async (id: string, values: AddVariantGroupRequest) => {
    const { data } = await axiosI.post<AddVariantGroupResponse>(
      `/products/${id}/variants`,
      values,
    );
    return data;
  },

  // Eliminar grupo de variantes
  removeVariantGroup: async (productId: string, groupId: string) => {
    const { data } = await axiosI.delete<RemoveVariantGroupResponse>(
      `/products/${productId}/variants/${groupId}`,
    );
    return data;
  },
};
