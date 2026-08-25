import { Payment } from "../types/payment";
import { BadgeCheck, BadgeX, CircleX } from "lucide-react";
import cn from "classnames";
import { usePaymentDetails } from "./hooks/usePaymentDetails";

export function PaymentDetails({
  payment,
  onRetry,
}: {
  payment: Payment;
  onRetry?: () => void;
}) {
  const { copySuccess, copyToClipboard } = usePaymentDetails();

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        {payment.status === "succeeded" && (
          <BadgeCheck className="stroke-lime-600 w-12 h-12" />
        )}
        {payment.status === "canceled" && (
          <CircleX className="stroke-gray-400 w-12 h-12" />
        )}
        {payment.status !== "succeeded" && payment.status !== "canceled" && (
          <BadgeX
            className={cn("w-12 h-12", {
              "stroke-red-600": payment.status === "failed",
              "stroke-blue-600": payment.status === "processing",
              "stroke-yellow-600": payment.status === "requires_action",
            })}
          />
        )}
        <h2
          className={cn("text-lg font-semibold", {
            "text-red-600": payment.status === "failed",
            "text-lime-600": payment.status === "succeeded",
            "text-blue-600": payment.status === "processing",
            "text-gray-400": payment.status === "canceled",
          })}
        >
          Payment{" "}
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </h2>

        {payment.errorMessage && (
          <p className="text-red-600">{payment.errorMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between w-full">
          <p>Payment ID:</p>
          <button
            className={cn("font-semibold border-none cursor-pointer", {
              "text-blue-600": copySuccess,
            })}
            onClick={() => copyToClipboard(payment.id)}
            aria-label="Copy Payment ID to clipboard"
            type="button"
          >
            {copySuccess ? "copied!" : payment.id}
          </button>
        </div>
        <div className="flex justify-between w-full">
          <p>Amount:</p>
          <p className="font-semibold">${payment.amount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Description:</p>
          <p className="font-semibold">{payment.description}</p>
        </div>
        <div className="flex justify-between w-full">
          <p>Date:</p>
          <p className="font-semibold">
            {new Date(payment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {onRetry &&
        (payment.status === "failed" || payment.status === "canceled") && (
          <button
            onClick={onRetry}
            className="payment-status-button"
            aria-label="Retry Payment"
            type="button"
          >
            Try Again
          </button>
        )}

      {payment.status === "requires_action" && payment.redirectUrl && (
        <a
          href={payment.redirectUrl}
          className="mt-8 inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
          aria-label="Complete 3DS Authentication"
        >
          Complete 3DS Authentication
        </a>
      )}
    </>
  );
}
