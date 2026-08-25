import { cancelPayment } from "../../api/payments";
import { usePaymentsStore } from "../../store/paymentsStore";
import { useShallow } from "zustand/shallow";

export function useProccessingPayment() {
  const { isCancelling, setIsCancelling } = usePaymentsStore(
    useShallow((state) => ({
      isCancelling: state.isCancelling,
      setIsCancelling: state.setIsCancelling,
    })),
  );

  const { payment } = usePaymentsStore(
    useShallow((state) => ({
      payment: state.payment,
    })),
  );

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
    payment,
  };
}
