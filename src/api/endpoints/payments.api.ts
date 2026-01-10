import type {
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  SplitPaymentRequest,
  SplitPaymentResponse,
  OrderPaymentsResponse,
  PaymentDetailResponse,
  IncrementalPaymentRequest,
  IncrementalPaymentResponse,
  PaymentProgressResponse,
} from "@/types/payments.types";
import axiosI from "../axios";

export const paymentsApi = {
  // Procesar pago incremental
  processIncrementalPayment: async (values: IncrementalPaymentRequest) => {
    const { data } = await axiosI.post<IncrementalPaymentResponse>(
      "/payments/incremental",
      values
    );
    return data;
  },

  // Obtener progreso de pagos
  getPaymentProgress: async (orderId: string) => {
    const { data } = await axiosI.get<PaymentProgressResponse>(
      `/payments/progress/${orderId}`
    );

    const { data: values } = await axiosI.get(`/payments/progress/${orderId}`);

    console.log("getPaymentProgress", values);

    return data;
  },

  // Obtener historial de pagos
  getPaymentHistory: async (orderId: string) => {
    const { data } = await axiosI.get<any>(`/payments/history/${orderId}`);
    return data;
  },
  // -----------------
  // Procesar pago simple
  processPayment: async (values: ProcessPaymentRequest) => {
    const { data } = await axiosI.post<ProcessPaymentResponse>(
      "/payments",
      values
    );
    return data;
  },

  // Procesar pago dividido
  processSplitPayment: async (values: SplitPaymentRequest) => {
    const { data } = await axiosI.post<SplitPaymentResponse>(
      "/payments/split",
      values
    );
    return data;
  },

  // Obtener pagos de una orden
  getOrderPayments: async (orderId: string) => {
    const { data } = await axiosI.get<OrderPaymentsResponse>(
      `/payments/order/${orderId}`
    );
    return data;
  },

  // Detalle de pago
  getPaymentDetail: async (paymentId: string) => {
    const { data } = await axiosI.get<PaymentDetailResponse>(
      `/payments/${paymentId}`
    );
    return data;
  },
};
