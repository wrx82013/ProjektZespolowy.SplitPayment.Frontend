import {
  CreateSplitPaymentRequestDto,
  SplitPaymentResponseDto,
} from "../types/api";

const API_BASE_URL = "http://3.71.231.81";

export const createSplitPayment = async (
  data: CreateSplitPaymentRequestDto,
): Promise<SplitPaymentResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/api/SplitPayment`, {
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
  const response = await fetch(`${API_BASE_URL}/api/SplitPayment/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get split payment");
  }

  return response.json();
};

export const validateSplitPayment = async (
  data: CreateSplitPaymentRequestDto,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/SplitPayment/validate`, {
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
