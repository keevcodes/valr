import { create } from "zustand";
import { Payment } from "../types/payment";

interface PaymentStore {
  payment: Payment | null;
  isProcessing: boolean;
  completedPayment: Payment | null;
  setPayment: (payment: Payment | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCompletedPayment: (completedPayment: Payment | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const usePaymentsStore = create<PaymentStore>()((set) => ({
  payment: null,
  error: null,
  setError: (error: string | null) => set({ error }),
  setPayment: (payment: Payment | null) => set({ payment }),
  isProcessing: false,
  completedPayment: null,
  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),
  setCompletedPayment: (completedPayment: Payment | null) =>
    set({ completedPayment }),
}));
