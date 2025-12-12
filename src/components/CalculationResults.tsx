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
      window.open(paymentUrl, "_blank");
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 rounded-lg bg-gray-900 p-3 sm:p-2.5 border border-solid border-gray-900">
        <div className="flex items-center justify-between sm:justify-center gap-2.5">
          <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            Suma
          </p>
          <p className="sm:hidden text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            {total}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-8">
          <p className="hidden sm:block text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            {total}
          </p>
          <div className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-5 sm:px-7 py-2.5">
            <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-gray-900">
              Policzono
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2.5 bg-gray-900 px-4 sm:px-[19px] py-6 rounded-lg">
        <div className="flex w-full flex-col items-start gap-[17px]">
          <p className="w-full font-['Roboto_Flex:Bold',sans-serif] text-xl sm:text-2xl font-bold text-custom-green">
            Do podziału : {total}
          </p>
          <div className="flex w-full flex-col items-start gap-3 font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green text-sm sm:text-base">
            {splits.map((split, index) => (
              <p key={index} className="w-full shrink-0">
                {split.name}: {split.amount}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 rounded-lg bg-gray-900 p-3 sm:p-2.5">
        <button
          onClick={handlePayClick}
          disabled={!paymentUrl}
          className="flex items-center justify-center gap-2.5 border-custom-green px-5 sm:px-7 py-2.5 rounded-lg border border-solid bg-gray-900 transition-colors hover:bg-gray-400 disabled:bg-custom-green-dark"
        >
          <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
            Zapłać
          </p>
        </button>
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-5 sm:px-7 py-2.5 transition-colors hover:bg-custom-green-darker"
        >
          <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-gray-900">
            Udostępnij
          </p>
          <CopyIcon />
        </button>
      </div>
    </div>
  );
}
