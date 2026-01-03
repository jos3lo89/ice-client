// src/features/products/hooks/useCategories.ts
import { categoriesApi } from "@/api/endpoints/categories.api";
import { useQuery } from "@tanstack/react-query";

export const queryKeys = {
  categories: ["categories"] as const,
  categoriesTree: ["categories", "tree"] as const,
  categoryBySlug: (slug: string) => ["categories", "slug", slug] as const,
  categoryById: (id: string) => ["categories", id] as const,
};

export const useCategories = () => {
  // Listar categorías
  const listCategoriesQuery = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.listCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Árbol jerárquico
  const categoriesTreeQuery = useQuery({
    queryKey: queryKeys.categoriesTree,
    queryFn: categoriesApi.hierarchicalTreeOfCategories,
    staleTime: 1000 * 60 * 5,
  });

  return {
    listCategoriesQuery,
    categoriesTreeQuery,
  };
};
