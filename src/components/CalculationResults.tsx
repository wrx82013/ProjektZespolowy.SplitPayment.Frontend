import { API_BASE_URL } from "@/lib/api";

interface Split {
  name: string;
  amount: string;
}

interface CalculationResultsProps {
  total: string;
  splits: Split[];
  onShare: () => void;
  paymentUrl?: string | null;
}

function CopyIcon() {
  return (
    <div className="size-4 shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g clipPath="url(#clip0_1_221)" id="Icon">
          <path
            d="M13.3333 5.33333H6.66667C5.93029 5.33333 5.33333 5.93029 5.33333 6.66667V13.3333C5.33333 14.0697 5.93029 14.6667 6.66667 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V6.66667C14.6667 5.93029 14.0697 5.33333 13.3333 5.33333Z"
            id="Vector"
            stroke="var(--stroke-0, #0A0A0A)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d="M2.66667 10.6667C1.93333 10.6667 1.33333 10.0667 1.33333 9.33333V2.66667C1.33333 1.93333 1.93333 1.33333 2.66667 1.33333H9.33333C10.0667 1.33333 10.6667 1.93333 10.6667 2.66667"
            id="Vector_2"
            stroke="var(--stroke-0, #0A0A0A)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_221">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function CalculationResults({
  total,
  splits,
  onShare,
  paymentUrl,
}: CalculationResultsProps) {
  const handlePayClick = () => {
    if (paymentUrl) {
      const url = new URL(paymentUrl);
      const endpoint = url.pathname;
      window.open(`${API_BASE_URL}${endpoint}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-end gap-6">
      <div className="flex w-2xl items-center justify-between rounded-lg bg-gray-900 p-2.5 border border-solid border-gray-900">
        <div className="flex items-center justify-center gap-2.5">
          <p className="font-['Roboto_Flex:Bold',sans-serif]font-bold text-nowrap whitespace-pre text-custom-green">
            Suma
          </p>
        </div>
        <div className="flex w-[526px] items-center justify-end gap-8">
          <p className="w-[391px] text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            {total}
          </p>
          <div className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-7 py-2.5">
            <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-nowrap whitespace-pre text-gray-900">
              Policzono
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-[613px] flex-col items-start gap-2.5 bg-gray-900 px-[19px] py-6">
        <div className="flex w-full flex-col items-start gap-[17px]">
          <p className="w-full font-['Roboto_Flex:Bold',sans-serif] text-2xl font-bold text-custom-green">
            Do podziału : {total}
          </p>
          <div className="flex w-full flex-col items-start gap-3 font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            {splits.map((split, index) => (
              <p key={index} className="w-full shrink-0">
                {split.name}: {split.amount}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex w-[611px] items-center justify-end gap-2.5 rounded-lg bg-gray-900 p-2.5">
        <button
          onClick={handlePayClick}
          disabled={!paymentUrl}
          className="flex items-center justify-center gap-2.5 bg-custom-green px-7 py-2.5 rounded-lg border border-solid border-gray-900 transition-colors hover:bg-custom-green-hover disabled:bg-gray-400"
        >
          <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-nowrap whitespace-pre text-black">
            Zapłać
          </p>
          <CopyIcon />
        </button>
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-7 py-2.5 transition-colors hover:bg-custom-green-darker"
        >
          <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-nowrap whitespace-pre text-gray-900">
            Udostępnij
          </p>
          <CopyIcon />
        </button>
        .
      </div>
    </div>
  );
}
