import { useState } from "react";
import { CardDetails } from "../../types/payment";
import { usePaymentsStore } from "../../store/paymentsStore";
import { useShallow } from "zustand/shallow";

export function useCheckoutForm(onSubmit: (cardDetails: CardDetails) => void) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const { isProcessing } = usePaymentsStore(
    useShallow((state) => ({
      isProcessing: state.isProcessing,
    })),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardDetails: CardDetails = {
      number: cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
      name: cardholderName,
    };

    onSubmit(cardDetails);
  };

  const formatCardNumber = (value: string) => {
    const groups = value.match(/.{1,4}/g);

    return groups ? groups.join(" ") : value;
  };

  return {
    formatCardNumber,
    cardNumber,
    setCardNumber,
    expiryMonth,
    setExpiryMonth,
    handleSubmit,
    setCardholderName,
    cardholderName,
    setExpiryYear,
    setCvc,
    cvc,
    expiryYear,
    isProcessing,
  };
}
