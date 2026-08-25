import { useEffect } from "react";
import { usePaymentsStore } from "../../store/paymentsStore";
import { useShallow } from "zustand/react/shallow";
import {
  clearPaymentFromStorage,
  getPaymentIdFromUrlParamsOrLocalStorage,
} from "../../utils/localStorageHelpers";
import { confirmPayment, getPaymentStatus } from "../../api/payments";

export function useReturnUrlHandler({
  onError,
}: {
  onError: (errorMessage: string) => void;
}) {
  const {
    payment,
    setPayment,
    isConfirming,
    setIsConfirming,
    handleCompletePayment,
  } = usePaymentsStore(
    useShallow((state) => ({
      payment: state.payment,
      isConfirming: state.isConfirming,
      setPayment: state.setPayment,
      setIsConfirming: state.setIsConfirming,
      handleCompletePayment: state.handleCompletePayment,
    })),
  );

  const params = new URLSearchParams(window.location.search);
  const redirectStatus = params.get("redirect_status");

  const paymentId = getPaymentIdFromUrlParamsOrLocalStorage();

  useEffect(() => {
    if (!paymentId) {
      throw new Error(
        "Could not find your payment Id. Please try a new payment or contact support.",
      );
    }

    const handleReturn = async () => {
      setIsConfirming(true);

      try {
        // Check current payment status
        const currentPayment = await getPaymentStatus(paymentId);

        setPayment(currentPayment);

        if (!redirectStatus) {
          return;
        }

        if (currentPayment.status === "requires_action") {
          // 3DS was completed, confirm the payment
          if (redirectStatus === "succeeded") {
            const confirmedPayment = await confirmPayment(currentPayment);
            handleCompletePayment(confirmedPayment);
            clearPaymentFromStorage(currentPayment.id);
          } else {
            onError("3DS authentication was not completed");
          }
        } else if (currentPayment.status === "succeeded") {
          handleCompletePayment(currentPayment);
        } else if (currentPayment.status === "failed") {
          onError(currentPayment.errorMessage || "Payment failed");
        }
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Failed to confirm payment",
        );
      } finally {
        setIsConfirming(false);
      }
    };

    handleReturn();
  }, [redirectStatus]);

  return {
    isConfirming,
    payment,
  };
}
