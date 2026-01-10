import type {
  OpenCashRegisterRequest,
  OpenCashRegisterResponse,
  CloseCashRegisterRequest,
  CloseCashRegisterResponse,
  CurrentCashRegisterResponse,
  CashRegisterSummaryResponse,
  TodayCashRegistersResponse,
  CreateCashMovementRequest,
  CreateCashMovementResponse,
  ListCashMovementsResponse,
  ListSalesResponse,
} from "@/types/cash-registers.types";
import axiosI from "../axios";

export const cashRegistersApi = {
  // abrir caja - provada
  openCashRegister: async (values: OpenCashRegisterRequest) => {
    const { data } = await axiosI.post<OpenCashRegisterResponse>(
      "/cash-registers/open",
      values
    );
    return data;
  },

  // cerrar caja - probadad
  closeCashRegister: async (values: CloseCashRegisterRequest) => {
    const { data } = await axiosI.post<CloseCashRegisterResponse>(
      "/cash-registers/close",
      values
    );
    return data;
  },

  // obtener caja actual - probaad
  getCurrentCashRegister: async () => {
    const { data } = await axiosI.get<CurrentCashRegisterResponse>(
      "/cash-registers/current"
    );

    // const { data: values } = await axiosI.get("/cash-registers/current");

    // console.log("valores de la caja actual: ", values);

    return data;
  },

  // Resumen de caja
  getCashRegisterSummary: async (id: string) => {
    const { data } = await axiosI.get<CashRegisterSummaryResponse>(
      `/cash-registers/${id}/summary`
    );
    return data;
  },

  // Cajas del día
  getTodayCashRegisters: async () => {
    const { data } = await axiosI.get<TodayCashRegistersResponse>(
      "/cash-registers/today"
    );

    const { data: values } = await axiosI.get("/cash-registers/today");

    console.log({
      values,
    });

    return data;
  },

  // Crear movimiento
  createMovement: async (values: CreateCashMovementRequest) => {
    const { data } = await axiosI.post<CreateCashMovementResponse>(
      "/cash-movements",
      values
    );
    return data;
  },

  // Listar movimientos de caja actual
  getCurrentMovements: async () => {
    const { data } = await axiosI.get<ListCashMovementsResponse>(
      "/cash-movements"
    );
    return data;
  },

  // Movimientos de una caja específica
  getRegisterMovements: async (registerId: string) => {
    const { data } = await axiosI.get<ListCashMovementsResponse>(
      `/cash-movements/register/${registerId}`
    );
    return data;
  },

  getCurrentSales: async () => {
    const { data } = await axiosI.get<ListSalesResponse>(
      "/cash-registers/current/sales"
    );
    return data;
  },
};
