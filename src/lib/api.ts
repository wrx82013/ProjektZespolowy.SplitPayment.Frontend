import {
  CreateSplitPaymentRequestDto,
  SplitPaymentResponseDto,
} from "../types/api";

// Next.js API routes - te są wywoływane z przeglądarki i komunikują się z backendem
export const createSplitPayment = async (
  data: CreateSplitPaymentRequestDto,
): Promise<SplitPaymentResponseDto> => {
  const response = await fetch(`/api/split-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create split payment");
  }

  return response.json();
};

export const getSplitPayment = async (
  id: string,
): Promise<SplitPaymentResponseDto> => {
  const response = await fetch(`/api/split-payment?id=${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get split payment");
  }

  return response.json();
};

export const validateSplitPayment = async (
  data: CreateSplitPaymentRequestDto,
): Promise<void> => {
  const response = await fetch(`/api/split-payment/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(", ") || "Validation failed");
  }
};
