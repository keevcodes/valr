import { useShallow } from "zustand/shallow";
import { usePaymentsStore } from "../store/paymentsStore";
import { PaymentDetails } from "./PaymentDetails";
import { ProcessingPayment } from "./ProcessingPayment";
import { Payment } from "../types/payment";

interface PaymentStatusProps {
  onRetry?: () => void;
  error: string | null;
  completedPayment: Payment | null;
}

/**
 * TODO: Implement Payment Status display
 *
 * This component should:
 * 1. Display the current payment status clearly
 * 2. Handle all possible states: pending, processing, requires_action, succeeded, failed, canceled
 * 3. Show appropriate UI for each state (icons, colors, messages)
 * 4. For 'requires_action': show a button/link to complete 3DS authentication
 * 5. For 'failed': show error message and retry option
 * 6. For 'succeeded': show confirmation with payment details
 *
 * Accessibility considerations:
 * - Don't rely on color alone to convey status (WCAG)
 * - Use appropriate ARIA attributes
 * - Ensure focus management for dynamic content
 *
 * Bonus features:
 * - Poll for status updates while in 'processing' state
 * - Show payment timeline/history
 * - Copy payment ID to clipboard
 */

export function PaymentStatus({
  onRetry,
  completedPayment,
}: PaymentStatusProps) {
  const { payment, isProcessing } = usePaymentsStore(
    useShallow((state) => ({
      payment: state.payment,
      isProcessing: state.isProcessing,
    })),
  );

  return (
    <div className="payment-status">
      {!isProcessing && completedPayment && (
        <PaymentDetails payment={completedPayment} onRetry={onRetry} />
      )}

      {isProcessing && <ProcessingPayment payment={payment} />}
    </div>
  );
}
