import { useState } from "react";

export function usePaymentDetails() {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
      console.error("Failed to copy: ", err);
    }
  };

  return {
    copySuccess,
    copyToClipboard,
  };
}
