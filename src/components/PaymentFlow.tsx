import { CheckoutForm } from "./CheckoutForm";

import { usePaymentFlow } from "./hooks/usePaymentFlow";

interface PaymentFlowProps {
  amount: number;
  total: number;
  fee: number;
  currency: string;
  description?: string;
  onError: (error: string) => void;
}

export function PaymentFlow({
  amount,
  currency,
  description,
  total,
  fee,
  onError,
}: PaymentFlowProps) {
  const { handleSubmit, isProcessing, payment } = usePaymentFlow({
    onError,
    total,
    description,
    currency,
  });

  return (
    <>
      {!isProcessing && !payment && (
        <CheckoutForm
          amount={amount}
          total={total}
          fee={fee}
          currency={currency}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
