import {
  CreateSplitPaymentRequestDto,
  SplitPaymentResponseDto,
} from "../types/api";
import { HistoryCalculation } from "@/types/history";

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

export const fetchHistoryCalculations = async (): Promise<
  HistoryCalculation[]
> => {
  const response = await fetch(`/api/history`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch history");
  }

  return response.json();
};

export const syncHistoryCalculations = async (
  calculations: HistoryCalculation[],
): Promise<void> => {
  const response = await fetch(`/api/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ calculations }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to sync history");
  }
};
