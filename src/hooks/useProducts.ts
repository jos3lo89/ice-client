import { productsApi } from "@/api/endpoints/products.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  AdjustStockRequest,
  ToggleAvailabilityRequest,
  AddVariantGroupRequest,
} from "@/types/products.types";

export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  productsByCategory: (categoryId: string) =>
    ["products", "category", categoryId] as const,
  productsByArea: (area: string) => ["products", "area", area] as const,
  featuredProducts: ["products", "featured"] as const,
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Listar productos
  const listProductsQuery = useQuery({
    queryKey: queryKeys.products,
    queryFn: productsApi.listProducts,
  });

  // Obtener producto por ID
  const useProductById = (id: string) => {
    return useQuery({
      queryKey: queryKeys.product(id),
      queryFn: () => productsApi.getProductById(id),
      enabled: !!id,
    });
  };

  // Productos por categoría
  const useProductsByCategory = (categoryId: string) => {
    return useQuery({
      queryKey: queryKeys.productsByCategory(categoryId),
      queryFn: () => productsApi.getProductsByCategory(categoryId),
      enabled: !!categoryId,
    });
  };

  // Productos por área
  const useProductsByArea = (area: string) => {
    return useQuery({
      queryKey: queryKeys.productsByArea(area),
      queryFn: () => productsApi.getProductsByArea(area),
      enabled: !!area,
    });
  };

  // Productos destacados
  const featuredProductsQuery = useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: productsApi.getFeaturedProducts,
  });

  // Crear producto
  const createProductMutation = useMutation({
    mutationFn: (values: CreateProductRequest) =>
      productsApi.createProduct(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al crear producto", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Actualizar producto
  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateProductRequest;
    }) => productsApi.updateProduct(id, values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.id),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al actualizar producto", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Desactivar producto
  const deactivateProductMutation = useMutation({
    mutationFn: (id: string) => productsApi.deactivateProduct(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al desactivar producto", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Activar producto
  const activateProductMutation = useMutation({
    mutationFn: (id: string) => productsApi.activateProduct(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al activar producto", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Ajustar stock
  const adjustStockMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: AdjustStockRequest }) =>
      productsApi.adjustStock(id, values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.id),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al ajustar stock", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Toggle availability
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ToggleAvailabilityRequest;
    }) => productsApi.toggleAvailability(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.id),
      });
      toast.success("Disponibilidad actualizada");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al cambiar disponibilidad", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Agregar grupo de variantes
  const addVariantGroupMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: AddVariantGroupRequest;
    }) => productsApi.addVariantGroup(id, values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.id),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al agregar variantes", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Eliminar grupo de variantes
  const removeVariantGroupMutation = useMutation({
    mutationFn: ({
      productId,
      groupId,
    }: {
      productId: string;
      groupId: string;
    }) => productsApi.removeVariantGroup(productId, groupId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.productId),
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al eliminar variantes", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  return {
    // Queries
    listProductsQry: listProductsQuery,
    useProductById,
    useProductsByCategory,
    useProductsByArea,
    featuredProductsQuery,

    // Mutations
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deactivateProduct: deactivateProductMutation,
    activateProduct: activateProductMutation,
    adjustStock: adjustStockMutation,
    toggleAvailability: toggleAvailabilityMutation,
    addVariantGroup: addVariantGroupMutation,
    removeVariantGroup: removeVariantGroupMutation,
  };
};
