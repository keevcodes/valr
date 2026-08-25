import { CardDetails } from "../types/payment";
import { formatAmount } from "../utils/amount";
import { useCheckoutForm } from "./hooks/useCheckoutForm";

interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSubmit: (cardDetails: CardDetails) => void;
  total: number;
  fee: number;
}

export function CheckoutForm({
  amount,
  currency,
  onSubmit,
  total,
  fee,
}: CheckoutFormProps) {
  const {
    handleSubmit,
    cardNumber,
    cardholderName,
    expiryMonth,
    expiryYear,
    cvc,
    setCardNumber,
    setCardholderName,
    setCvc,
    setExpiryMonth,
    setExpiryYear,
    formatCardNumber,
    isProcessing,
  } = useCheckoutForm(onSubmit);

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="amount-display">
          <span className="label">Subscription Total</span>
          <span className="amount">{formatAmount(amount, currency)}</span>
        </div>
        <div className="amount-display">
          <span className="label">Fee</span>
          <span className="amount">{formatAmount(fee, currency)}</span>
        </div>

        <div className="amount-display">
          <span className="label">Total</span>
          <span className="amount">{formatAmount(total, currency)}</span>
        </div>
      </div>

      <div className="payment-details">
        <h2>Payment Details</h2>

        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name</label>
          <input
            id="cardholderName"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            type="text"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            minLength={13}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryMonth">Expiry Month</label>
            <input
              id="expiryMonth"
              type="text"
              value={expiryMonth}
              onChange={(e) =>
                setExpiryMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
              }
              placeholder="MM"
              maxLength={2}
              minLength={2}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryYear">Expiry Year</label>
            <input
              id="expiryYear"
              type="text"
              value={expiryYear}
              onChange={(e) =>
                setExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 2))
              }
              placeholder="YY"
              maxLength={2}
              minLength={2}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cvc">CVC</label>
            <input
              id="cvc"
              type="text"
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="pay-button" disabled={isProcessing}>
        Pay {formatAmount(total, currency)}
      </button>

      <p className="security-note">
        Your payment is secured with 256-bit encryption
      </p>
    </form>
  );
}
