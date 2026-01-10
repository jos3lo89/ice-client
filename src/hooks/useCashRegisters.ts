// src/features/cash-registers/hooks/useCashRegisters.ts
import { cashRegistersApi } from "@/api/endpoints/cash-registers.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  OpenCashRegisterRequest,
  CloseCashRegisterRequest,
  CreateCashMovementRequest,
} from "@/types/cash-registers.types";

export const queryKeys = {
  // currentCashRegister: ["cash-registers", "current"] as const,
  cashRegisterSummary: (id: string) =>
    ["cash-registers", id, "summary"] as const,
  todayCashRegisters: ["cash-registers", "today"] as const,
  currentMovements: ["cash-movements", "current"] as const,
  registerMovements: (registerId: string) =>
    ["cash-movements", "register", registerId] as const,
};

export const useCashRegisters = () => {
  const queryClient = useQueryClient();

  // Ventas de caja actual

  // Obtener caja actual
  const currentCashRegisterQuery = useQuery({
    queryKey: ["cash-registers", "current"],
    queryFn: cashRegistersApi.getCurrentCashRegister,
    // staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });

  const currentSalesQuery = useQuery({
    queryKey: ["cash-registers", "current", "sales"],
    queryFn: cashRegistersApi.getCurrentSales,
    enabled: !!currentCashRegisterQuery.data?.data,
    staleTime: 1000 * 30,
  });

  // Resumen de caja
  const useCashRegisterSummary = (id: string) => {
    return useQuery({
      queryKey: queryKeys.cashRegisterSummary(id),
      queryFn: () => cashRegistersApi.getCashRegisterSummary(id),
      enabled: !!id,
    });
  };

  // Cajas del día
  const todayCashRegistersQuery = useQuery({
    queryKey: queryKeys.todayCashRegisters,
    queryFn: cashRegistersApi.getTodayCashRegisters,
    staleTime: 1000 * 60, // 1 minuto
  });

  // Movimientos actuales
  const currentMovementsQuery = useQuery({
    queryKey: queryKeys.currentMovements,
    queryFn: cashRegistersApi.getCurrentMovements,
    enabled: !!currentCashRegisterQuery.data?.data,
    staleTime: 1000 * 30,
  });

  // Abrir caja
  const openCashRegisterMutation = useMutation({
    mutationFn: (values: OpenCashRegisterRequest) =>
      cashRegistersApi.openCashRegister(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.todayCashRegisters });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al abrir caja", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Cerrar caja
  const closeCashRegisterMutation = useMutation({
    mutationFn: (values: CloseCashRegisterRequest) =>
      cashRegistersApi.closeCashRegister(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todayCashRegisters });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });

      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Error al cerrar caja", {
          description: error.response?.data.message,
        });
      } else {
        toast.error("Error al cerrar caja", {
          description: "Intenta nuevamente",
        });
      }
    },
  });

  // Crear movimiento
  const createMovementMutation = useMutation({
    mutationFn: (values: CreateCashMovementRequest) =>
      cashRegistersApi.createMovement(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentMovements });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });
      toast.success("Movimiento registrado");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al crear movimiento", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  return {
    // Queries
    currentCashRegisterQuery,
    useCashRegisterSummary,
    todayCashRegistersQuery,
    currentMovementsQuery,
    currentSalesQuery,

    // Mutations
    openCashRegister: openCashRegisterMutation,
    closeCashRegister: closeCashRegisterMutation,
    createMovement: createMovementMutation,
  };
};
