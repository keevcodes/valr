import { useShallow } from "zustand/react/shallow";
import { createPayment, getPaymentStatus } from "../../api/payments";
import { usePaymentsStore } from "../../store/paymentsStore";
import { CardDetails, Payment } from "../../types/payment";

interface UsePaymentFlow {
  onComplete: (payment: Payment) => void;
  onError: (error: string) => void;
  total: number;
  description?: string;
  currency: string;
}

export function usePaymentFlow({
  onComplete,
  onError,
  total,
  description,
  currency,
}: UsePaymentFlow) {
  const { setPayment, setIsProcessing, isProcessing, payment } =
    usePaymentsStore(
      useShallow((state) => ({
        payment: state.payment,
        setPayment: state.setPayment,
        setIsProcessing: state.setIsProcessing,
        isProcessing: state.isProcessing,
      })),
    );

  const pollForCompletion = async (paymentId: string) => {
    // Simple polling — check every 2 seconds, max 30 seconds
    const maxAttempts = 15;
    let attempts = 0;

    const poll = async () => {
      attempts++;

      try {
        const updatedPayment = await getPaymentStatus(paymentId);

        if (updatedPayment.status === "succeeded") {
          onComplete(updatedPayment);
          return;
        }

        if (updatedPayment.status === "failed") {
          onComplete(updatedPayment);
          setIsProcessing(false);
          return;
        }

        if (updatedPayment.status === "canceled") {
          onComplete(updatedPayment);
          setIsProcessing(false);
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          onError(
            "Payment is taking longer than expected. Please check your payment history.",
          );
          setIsProcessing(false);
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          onError("Unable to confirm payment status");
          setIsProcessing(false);
        }
      }
    };

    poll();
  };

  const handleSubmit = async (_cardDetails: CardDetails) => {
    setIsProcessing(true);

    try {
      const newPayment = await createPayment({
        amount: total,
        currency,
        description,
        returnUrl: window.location.href,
      });

      setPayment(newPayment);

      // Instead, this code treats it as terminal and shows an error
      if (newPayment.status === "processing") {
        // Poll for final status
        pollForCompletion(newPayment.id);
      } else if (newPayment.status === "succeeded") {
        onComplete(newPayment);
      } else {
        onComplete(newPayment);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  return {
    handleSubmit,
    isProcessing,
    payment,
  };
}
