import { Payment } from "../types/payment";

export function getPaymentIdFromUrlParamsOrLocalStorage(): string | null {
  const params = new URLSearchParams(window.location.search);
  const paymentIdFromURL = params.get("payment_id");

  if (paymentIdFromURL) {
    return paymentIdFromURL;
  }

  if (!paymentIdFromURL) {
    const paymentId = localStorage.getItem("paymentId");

    if (paymentId) {
      return paymentId;
    }
  }

  return null;
}

export function getPaymentFromStorage(paymentId: string): Payment | null {
  const payment = localStorage.getItem(paymentId);

  return payment ? JSON.parse(payment) : null;
}

export function setPaymentInStorage(payment: Payment): void {
  localStorage.setItem(payment.id, JSON.stringify(payment));
  localStorage.setItem("paymentId", payment.id);
}

export function clearPaymentFromStorage(paymentId: string): void {
  localStorage.removeItem("paymentId");
  localStorage.removeItem(paymentId);
}
