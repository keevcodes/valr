import { create } from "zustand";
import { Payment } from "../types/payment";

interface PaymentStore {
  payment: Payment | null;
  isProcessing: boolean;
  completedPayment: Payment | null;
  isConfirming: boolean;
  isCancelling: boolean;
  setPayment: (payment: Payment | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCompletedPayment: (completedPayment: Payment | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setIsConfirming: (isConfirming: boolean) => void;
  handleCompletePayment: (payment: Payment) => void;
  setIsCancelling: (isCancelling: boolean) => void;
}

export const usePaymentsStore = create<PaymentStore>()((set) => ({
  payment: null,
  error: null,
  isConfirming: false,
  setError: (error: string | null) => set({ error }),
  setPayment: (payment: Payment | null) => set({ payment }),
  isProcessing: false,
  completedPayment: null,
  isCancelling: false,
  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),
  setCompletedPayment: (completedPayment: Payment | null) =>
    set({ completedPayment }),
  setIsConfirming: (isConfirming: boolean) => set({ isConfirming }),
  handleCompletePayment: (payment: Payment) =>
    set({
      completedPayment: payment,
      isProcessing: false,
      error: null,
    }),
  setIsCancelling: (isCancelling: boolean) => set({ isCancelling }),
}));
