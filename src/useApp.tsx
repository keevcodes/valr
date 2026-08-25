import { useShallow } from "zustand/react/shallow";
import { usePaymentsStore } from "./store/paymentsStore";
import { Payment } from "./types/payment";
import { calculateTotal } from "./utils/amount";
import { useEffect } from "react";

export function useApp() {
  const {
    payment,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    setPayment,
    setCompletedPayment,
    completedPayment,
  } = usePaymentsStore(
    useShallow((state) => ({
      payment: state.payment,
      isProcessing: state.isProcessing,
      error: state.error,
      completedPayment: state.completedPayment,
      setIsProcessing: state.setIsProcessing,
      setError: state.setError,
      setPayment: state.setPayment,
      setCompletedPayment: state.setCompletedPayment,
    })),
  );

  // Demo checkout configuration
  const checkoutConfig = {
    amount: 99.99,
    currency: "USD",
    description: "Premium Subscription",
    feePercentage: 10, // 10% fee for demo
  };

  const { fee, total } = calculateTotal(checkoutConfig.amount, 10);

  const handlePaymentComplete = (payment: Payment) => {
    setCompletedPayment(payment);
    setIsProcessing(false);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleRetry = () => {
    setError(null);
    setCompletedPayment(null);
    setPayment(null);
    // retries from a failed 3DS auth can cause infite loops, clear window history
    window.location.href = window.location.origin;
  };

  const isReturningFrom3DS = window.location.search.includes("payment_id");

  useEffect(() => {
    if (isReturningFrom3DS) {
      const params = new URLSearchParams(window.location.search);

      params.set("redirect_status", "succeeded");

      const pathWithRedirectStatus =
        window.location.pathname + "?" + params.toString();

      window.history.replaceState(null, "", pathWithRedirectStatus);
    }
  }, []);

  return {
    payment,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    setPayment,
    completedPayment,
    handleError,
    handlePaymentComplete,
    handleRetry,
    checkoutConfig,
    fee,
    total,
    isReturningFrom3DS,
  };
}
