import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeactivateCategoryResponse,
  HierarchicalTreeOfCategoriesResponse,
  ListCategoriesResponse,
  SearchForIdResponse,
  SearchForSlugResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@/types/categories.types";
import axiosI from "../axios";

export const categoriesApi = {
  createCategory: async (category: CreateCategoryRequest) => {
    const { data } = await axiosI.post<CreateCategoryResponse>(
      "/categories",
      category,
    );
    return data;
  },

  listCategories: async () => {
    const { data } = await axiosI.get<ListCategoriesResponse>("/categories");

    return data;
  },

  hierarchicalTreeOfCategories: async () => {
    const { data } =
      await axiosI.get<HierarchicalTreeOfCategoriesResponse>(
        "/categories/tree",
      );
    return data;
  },
  searchForSlug: async (slug: string) => {
    const { data } = await axiosI.get<SearchForSlugResponse>(
      `/categories/slug/${slug}`,
    );
    return data;
  },

  searchForId: async (id: string) => {
    const { data } = await axiosI.get<SearchForIdResponse>(`/categories/${id}`);
    return data;
  },

  updateCategory: async (id: string, category: UpdateCategoryRequest) => {
    const { data } = await axiosI.patch<UpdateCategoryResponse>(
      `/categories/${id}`,
      category,
    );
    return data;
  },

  // TODO: implementar en el backend
  deactivateCategory: async (id: string) => {
    const { data } = await axiosI.delete<DeactivateCategoryResponse>(
      `/categories/${id}`,
    );
    return data;
  },
};
