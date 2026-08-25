export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  clientSecret?: string;
  redirectUrl?: string;
  returnUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'crypto';
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId?: string;
  description?: string;
  returnUrl: string;
}

export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
}

export interface CheckoutState {
  step: 'details' | 'processing' | 'requires_action' | 'complete' | 'error';
  payment: Payment | null;
  error: string | null;
}
