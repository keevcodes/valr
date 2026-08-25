import { Header } from "./components/Header";
import { PaymentFlow } from "./components/PaymentFlow";
import { PaymentStatus } from "./components/PaymentStatus";
import { ReturnUrlHandler } from "./components/ReturnUrlHandler";

import { useApp } from "./useApp";

/**
 * Main checkout application
 *
 * - Loading state while initializing
 * - Clear decline/error state with retry option
 * - Processing state with appropriate messaging
 * - Success state with confirmation details
 *
 */
function App() {
  const {
    payment,
    isProcessing,
    error,
    completedPayment,
    handleError,
    handlePaymentComplete,
    handleRetry,
    fee,
    total,
    checkoutConfig,
    isReturningFrom3DS,
  } = useApp();

  return (
    <div className="app">
      <Header />
      <main className="checkout-container">
        {isReturningFrom3DS && !completedPayment && (
          <ReturnUrlHandler
            onPaymentConfirmed={handlePaymentComplete}
            onError={handleError}
          />
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRetry} type="button">
              Try Again
            </button>
          </div>
        )}

        {(completedPayment || isProcessing || payment) && !error && (
          <PaymentStatus
            onRetry={handleRetry}
            error={error}
            completedPayment={completedPayment}
          />
        )}

        {!isReturningFrom3DS && (
          <PaymentFlow
            amount={checkoutConfig.amount}
            total={total}
            fee={fee}
            currency={checkoutConfig.currency}
            description={checkoutConfig.description}
            onComplete={handlePaymentComplete}
            onError={handleError}
          />
        )}
      </main>
    </div>
  );
}

export default App;
