import { Payment, CreatePaymentRequest, PaymentStatus } from "../types/payment";
import {
  getPaymentFromStorage,
  getPaymentIdFromUrlParamsOrLocalStorage,
  setPaymentInStorage,
} from "../utils/localStorageHelpers";

// Simulated payment storage (in-memory for demo purposes)
const payments: Map<string, Payment> = new Map();

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a random payment ID
const generateId = () => `pay_${Math.random().toString(36).substring(2, 15)}`;

// Simulate random outcomes for demo
const getRandomOutcome = (): PaymentStatus => {
  const rand = Math.random();
  if (rand < 0.6) return "succeeded";
  if (rand < 0.8) return "requires_action";
  return "failed";
};

/**
 * Create a new payment
 *
 */
export async function createPayment(
  request: CreatePaymentRequest,
): Promise<Payment> {
  // Simulate network latency
  await delay(800 + Math.random() * 1200);

  const now = new Date().toISOString();
  const outcome = getRandomOutcome();

  const payment: Payment = {
    id: generateId(),
    amount: request.amount,
    currency: request.currency,
    status: outcome === "requires_action" ? "requires_action" : "processing",
    description: request.description,
    createdAt: now,
    updatedAt: now,
  };

  // If requires 3DS, add redirect URL
  if (outcome === "requires_action") {
    payment.redirectUrl = `/3ds-challenge?payment_id=${payment.id}`;
    payment.returnUrl = request.returnUrl;
    payment.clientSecret = `secret_${payment.id}`;
    setPaymentInStorage(payment);
  }

  setPaymentInStorage(payment);

  // Simulate async processing for non-3DS payments
  if (outcome !== "requires_action") {
    setTimeout(
      () => {
        const paymentId = getPaymentIdFromUrlParamsOrLocalStorage();

        if (paymentId) {
          const p = getPaymentFromStorage(paymentId);

          if (p && p.status === "processing") {
            p.status = outcome;
            p.updatedAt = new Date().toISOString();
            if (outcome === "failed") {
              p.errorMessage = "Payment was declined by the issuer";
            }

            setPaymentInStorage(p);
          }
        }
      },
      2000 + Math.random() * 2000,
    );
  }

  return payment;
}

/**
 * Get payment status
 *
 */
export async function getPaymentStatus(paymentId: string): Promise<Payment> {
  await delay(200 + Math.random() * 300);

  const payment = getPaymentFromStorage(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return { ...payment };
}

/**
 * Confirm payment after 3DS challenge
 */
export async function confirmPayment(payment: Payment): Promise<Payment> {
  await delay(500 + Math.random() * 500);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "succeeded") {
    throw new Error("Payment does not require confirmation");
  }

  // 80% success rate after 3DS
  const succeeded = Math.random() < 0.8;

  payment.status = succeeded ? "succeeded" : "failed";
  payment.updatedAt = new Date().toISOString();

  if (!succeeded) {
    payment.errorMessage = "3DS authentication failed";
  }

  return { ...payment };
}

/**
 * Cancel a payment
 */
export async function cancelPayment(paymentId: string): Promise<Payment> {
  await delay(300);

  const payment = getPaymentFromStorage(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "succeeded") {
    throw new Error("Cannot cancel a succeeded payment");
  }

  payment.status = "canceled";
  payment.updatedAt = new Date().toISOString();

  setPaymentInStorage(payment);

  return { ...payment };
}

// For testing/demo: seed a payment that can be "found" after redirect
export function seedPayment(payment: Payment): void {
  setPaymentInStorage(payment);
}

// For testing: clear all payments
export function clearPayments(): void {
  payments.clear();
}
