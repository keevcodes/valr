import { useReturnUrlHandler } from "./hooks/useReturnUrlHandler";

interface ReturnUrlHandlerProps {
  onError: (error: string) => void;
}

/**
 * Handles the return from 3DS authentication
 *
 * When user returns from 3DS, React state is gone (page was reloaded)
 * The payment_id from URL params is parsed, but there's no persistence
 *
 * What SHOULD happen:
 * - Before redirect, save payment ID to localStorage
 * - On return, read from localStorage if URL param is missing
 * - Clear localStorage after successful confirmation
 *
 * What ACTUALLY happens:
 * - Only reads from URL params
 * - If URL params are missing/malformed, user is stuck
 * - No recovery mechanism for lost state
 */
export function ReturnUrlHandler({ onError }: ReturnUrlHandlerProps) {
  const { payment } = useReturnUrlHandler({
    onError,
  });

  return (
    <div className="confirming-payment">
      <div className="spinner" />
      <h2>Confirming Payment</h2>
      <p>Please wait while we confirm your payment...</p>
      {payment && <p className="payment-id">Payment ID: {payment.id}</p>}
    </div>
  );
}
