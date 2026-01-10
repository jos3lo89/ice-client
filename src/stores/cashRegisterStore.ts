import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CashRegisterState {
  currentCashRegisterId: string | null;
  isOpen: boolean;

  setCurrentCashRegister: (id: string | null, isOpen: boolean) => void;
  clearCashRegister: () => void;
}

export const useCashRegisterStore = create<CashRegisterState>()(
  persist(
    (set) => ({
      currentCashRegisterId: null,
      isOpen: false,

      setCurrentCashRegister: (id, isOpen) =>
        set({ currentCashRegisterId: id, isOpen }),

      clearCashRegister: () =>
        set({ currentCashRegisterId: null, isOpen: false }),
    }),
    {
      name: "cash-register-storage",
    }
  )
);
