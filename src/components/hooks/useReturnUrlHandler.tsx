import { useEffect, useState } from "react";
import { usePaymentsStore } from "../../store/paymentsStore";
import { useShallow } from "zustand/react/shallow";
import {
  clearPaymentFromStorage,
  getPaymentFromStorage,
  getPaymentIdFromParamsOrStorage,
} from "../../utils/localStorageHelpers";
import {
  confirmPayment,
  getPaymentStatus,
  seedPayment,
} from "../../api/payments";
import { Payment } from "../../types/payment";

export function useReturnUrlHandler({
  onError,
  onPaymentConfirmed,
}: {
  onError: (errorMessage: string) => void;
  onPaymentConfirmed: (payment: Payment) => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { payment, setPayment } = usePaymentsStore(
    useShallow((state) => ({
      payment: state.payment,
      setPayment: state.setPayment,
    })),
  );

  const params = new URLSearchParams(window.location.search);
  const redirectStatus = params.get("redirect_status");
  const paymentId = getPaymentIdFromParamsOrStorage();

  useEffect(() => {
    if (!redirectStatus) {
      const payment = getPaymentFromStorage();

      if (payment) {
        seedPayment(payment);
      }

      clearPaymentFromStorage();
    }
  }, []);

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

        if (currentPayment.status === "requires_action") {
          // 3DS was completed, confirm the payment
          if (redirectStatus === "succeeded") {
            const confirmedPayment = await confirmPayment(paymentId);
            onPaymentConfirmed(confirmedPayment);
          } else {
            onError("3DS authentication was not completed");
          }
        } else if (currentPayment.status === "succeeded") {
          onPaymentConfirmed(currentPayment);
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
  }, [onPaymentConfirmed]);

  return {
    isConfirming,
    payment,
  };
}
