import { Payment } from "../types/payment";

export function getPaymentIdFromParamsOrStorage(): string | null {
  const params = new URLSearchParams(window.location.search);
  const paymentIdFromURL = params.get("payment_id");

  if (paymentIdFromURL) {
    return paymentIdFromURL;
  }

  const paymentFromStorage = localStorage.getItem("payments-storage");

  if (paymentFromStorage) {
    const parsedPayment = JSON.parse(paymentFromStorage);
    return parsedPayment?.payment?.id || null;
  }

  return null;
}

export function getPaymentFromStorage(): Payment | null {
  const payment = localStorage.getItem("payments-storage");

  return payment ? JSON.parse(payment) : null;
}

export function setPaymentInStorage(payment: Payment): void {
  localStorage.setItem("payments-storage", JSON.stringify(payment));
}

export function clearPaymentFromStorage(): void {
  localStorage.removeItem("payments-storage");
}
