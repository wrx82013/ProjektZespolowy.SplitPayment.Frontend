import Link from "next/link";
import {
  PaymentStatus,
  SplitPaymentResponseDto,
  UserPaymentDto,
} from "@/types/api";

interface HistoryItemProps {
  entry: SplitPaymentResponseDto;
  onRemove: (requestId: string) => void;
}

const statusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Pending",
  [PaymentStatus.InProgress]: "In progress",
  [PaymentStatus.Completed]: "Completed",
  [PaymentStatus.Cancelled]: "Cancelled",
  [PaymentStatus.Failed]: "Failed",
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }
  return parsed.toLocaleString();
};

const formatTotal = (
  amount: number,
  currency?: string | null,
) => `${amount.toFixed(2)} ${currency ?? ""}`.trim();

const countParticipants = (users?: UserPaymentDto[] | null) =>
  users?.length ?? 0;

function TrashIcon() {
  return (
    <div className="absolute top-[7px] left-[8px] size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

function DetailsIcon() {
  return (
    <div className="absolute top-[7px] left-[8px] size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

export default function HistoryItem({ entry, onRemove }: HistoryItemProps) {
  return (
    <div className="relative flex w-full flex-col gap-3 rounded-xl border border-gray-200 p-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative box-border flex w-full flex-1 flex-col gap-1 rounded-lg p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-gray-900"
        />
        <p className="relative w-full break-words font-['Roboto_Flex:Regular',sans-serif] text-lg font-semibold text-gray-900">
          {entry.description || "Split payment"}
        </p>
        <p className="relative text-sm text-gray-600">
          Request ID:{" "}
          <span className="font-mono text-xs">{entry.requestId}</span>
        </p>
        <p className="relative text-sm text-gray-600">
          Status: {statusLabel[entry.status] ?? "Unknown"}
        </p>
        <p className="relative text-sm text-gray-600">
          Total: {formatTotal(entry.totalAmount, entry.currency)}
        </p>
        <p className="relative text-sm text-gray-600">
          Participants: {countParticipants(entry.userPayments)}
        </p>
        <p className="relative text-xs text-gray-500">
          Created at: {formatDate(entry.createdAt)}
        </p>
      </div>
      <div className="relative flex flex-wrap items-center gap-3">
        <button
          onClick={() => onRemove(entry.requestId)}
          className="relative size-[44px] shrink-0 rounded-lg bg-custom-red transition-colors hover:bg-custom-red-dark"
          aria-label="Remove from history"
        >
          <TrashIcon />
        </button>
        <Link
          href={`/payment/${entry.requestId}`}
          className="relative flex size-[44px] items-center justify-center rounded-lg bg-custom-green transition-colors hover:bg-custom-green-dark"
          aria-label="View details"
        >
          <DetailsIcon />
        </Link>
      </div>
    </div>
  );
}
