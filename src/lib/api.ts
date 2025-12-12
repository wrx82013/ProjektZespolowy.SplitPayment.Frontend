import {
  CreateSplitPaymentRequestDto,
  ReceiptRecognitionResponse,
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
    const message = errorData?.message || errorData?.errors?.join?.(", ") || "Failed to create split payment";
    throw new Error(message);
  }

  return response.json();
};

export const getSplitPayment = async (
  id: string,
): Promise<SplitPaymentResponseDto> => {
  const response = await fetch(`/api/split-payment?id=${encodeURIComponent(id)}`);

  if (!response.ok) {
    const errorData = await response.json();
    const message = errorData?.message || errorData?.errors?.join?.(", ") || "Failed to get split payment";
    throw new Error(message);
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
    const errors = Array.isArray(errorData.errors) ? errorData.errors : [];
    const message = errors.length > 0 ? errors.join(", ") : errorData.message || "Validation failed";
    throw new Error(message);
  }
};

export const uploadReceipt = async (
  file: File,
): Promise<ReceiptRecognitionResponse> => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await fetch(`/api/receipt`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to parse receipt");
  }

  return response.json();
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
