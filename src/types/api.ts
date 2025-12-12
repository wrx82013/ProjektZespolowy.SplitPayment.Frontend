export enum SplitType {
  Percentage = 0,
  Custom = 1,
}

export enum PaymentStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
  Failed = 4,
}

export enum UserPaymentStatus {
  Pending = 0,
  Paid = 1,
  Overdue = 2,
  Cancelled = 3,
}

export interface UserPaymentInputDto {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  isExcluded?: boolean | null;
  percentage?: number | null;
  amount?: number | null;
  excludedItemIds?: string[];
}

export interface BillItemInputDto {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

export interface CreateSplitPaymentRequestDto {
  totalAmount: number;
  currency?: string | null;
  splitType: SplitType;
  description?: string | null;
  users?: UserPaymentInputDto[] | null;
  items?: BillItemInputDto[] | null;
}

export interface UserPaymentDto {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  amount: number;
  percentage?: number | null;
  status: UserPaymentStatus;
}

export interface SplitPaymentResponseDto {
  requestId: string;
  totalAmount: number;
  currency?: string | null;
  splitType: SplitType;
  description?: string | null;
  status: PaymentStatus;
  createdAt: string;
  userPayments?: UserPaymentDto[] | null;
  paymentUrl?: string | null;
  items?: BillItemInputDto[] | null;
}

export interface ValidationErrorResponse {
  message?: string | null;
  errors?: string[] | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}

export interface ReceiptRecognitionResponse {
  items: BillItemInputDto[];
  total: number;
  currency: string;
  sourceHint?: string;
}
