// src/features/payments/hooks/usePayments.ts
import { paymentsApi } from "@/api/endpoints/payments.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  IncrementalPaymentRequest,
  ProcessPaymentRequest,
  SplitPaymentRequest,
} from "@/types/payments.types";

export const queryKeys = {
  orderPayments: (orderId: string) => ["payments", "order", orderId] as const,
  paymentDetail: (paymentId: string) => ["payments", paymentId] as const,
};

export const usePayments = () => {
  const queryClient = useQueryClient();

  // Pagos de una orden
  const useOrderPayments = (orderId: string) => {
    return useQuery({
      queryKey: queryKeys.orderPayments(orderId),
      queryFn: () => paymentsApi.getOrderPayments(orderId),
      enabled: !!orderId,
    });
  };

  // Detalle de pago
  const usePaymentDetail = (paymentId: string) => {
    return useQuery({
      queryKey: queryKeys.paymentDetail(paymentId),
      queryFn: () => paymentsApi.getPaymentDetail(paymentId),
      enabled: !!paymentId,
    });
  };

  // Procesar pago simple
  const processPaymentMutation = useMutation({
    mutationFn: (values: ProcessPaymentRequest) =>
      paymentsApi.processPayment(values),
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al procesar pago", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Procesar pago dividido
  const processSplitPaymentMutation = useMutation({
    mutationFn: (values: SplitPaymentRequest) =>
      paymentsApi.processSplitPayment(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al procesar pago dividido", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // -----------
  // Procesar pago incremental
  const processIncrementalPaymentMutation = useMutation({
    mutationFn: (values: IncrementalPaymentRequest) =>
      paymentsApi.processIncrementalPayment(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers", "current"],
      });
      toast.success(data.message);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error("Error al procesar pago incremental", {
        description: error.response?.data?.message || "Intenta nuevamente",
      });
    },
  });

  // Query para progreso de pagos
  const usePaymentProgress = (orderId: string) => {
    return useQuery({
      // queryKey: queryKeys.paymentProgress(orderId),
      queryKey: ["payments", "increment", orderId],
      queryFn: () => paymentsApi.getPaymentProgress(orderId),
      enabled: !!orderId,
      refetchInterval: 10000, // Auto-refresh cada 10s
    });
  };

  return {
    // Queries
    useOrderPayments,
    usePaymentDetail,

    // Mutations
    processPayment: processPaymentMutation,
    processSplitPayment: processSplitPaymentMutation,
    // ---------
    processIncrementalPayment: processIncrementalPaymentMutation,
    usePaymentProgress,
  };
};
