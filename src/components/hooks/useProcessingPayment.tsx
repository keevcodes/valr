import { useState } from "react";
import { cancelPayment } from "../../api/payments";

export function useProccessingPayment() {
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelPaymentHandler = async (paymentId: string) => {
    try {
      setIsCancelling(true);
      await cancelPayment(paymentId);
    } catch (error) {
      alert("Failed to cancel payment");
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    cancelPaymentHandler,
    isCancelling,
  };
}
