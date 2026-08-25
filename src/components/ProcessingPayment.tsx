import { useState } from "react";
import { Payment } from "../types/payment";
import { useProccessingPayment } from "./hooks/useProcessingPayment";

type ProcessingPaymentProps = {
  payment: Payment | null;
};

export function ProcessingPayment({ payment }: ProcessingPaymentProps) {
  const { cancelPaymentHandler } = useProccessingPayment();
  const [isCancelling, setIsCancelling] = useState(false);

  return (
    <div>
      <div className="spinner" />
      {isCancelling || payment?.status === "canceled" ? (
        <h2>Canceling Payment</h2>
      ) : (
        <h2>Processing Payment</h2>
      )}
      {isCancelling || payment?.status === "canceled" ? (
        <p>Attempting to cancel your payemnt </p>
      ) : (
        <p>Please wait while we process your payment </p>
      )}
      {payment && <p className="payment-id">Payment ID: {payment.id}</p>}
      {payment && (
        <button
          aria-label="cancel payment"
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer border border-gray-300 rounded px-4 py-2 w-full h-8 outline outline-solid"
          onClick={() => {
            setIsCancelling(true);
            cancelPaymentHandler(payment.id);
          }}
          disabled={isCancelling || payment.status === "canceled"}
          type="button"
        >
          Cancel Payment
        </button>
      )}
    </div>
  );
}
