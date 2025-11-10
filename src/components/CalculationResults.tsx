interface Split {
  name: string;
  amount: string;
}

interface CalculationResultsProps {
  total: string;
  splits: Split[];
  onShare: () => void;
}

function CopyIcon() {
  return (
    <div className="relative size-4 shrink-0">
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
}: CalculationResultsProps) {
  return (
    <div className="relative flex shrink-0 flex-col content-stretch items-end gap-[24px]">
      <div className="relative box-border flex w-[611px] shrink-0 content-stretch items-center justify-between rounded-lg bg-gray-900 p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-gray-900"
        />
        <div className="relative flex shrink-0 content-stretch items-center justify-center gap-2.5">
          <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-nowrap whitespace-pre text-custom-green not-italic">
            Suma
          </p>
        </div>
        <div className="relative flex w-[526px] shrink-0 content-stretch items-center justify-end gap-[32px]">
          <p className="relative w-[391px] shrink-0 text-right font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-custom-green not-italic">
            {total}
          </p>
          <div className="relative box-border flex shrink-0 content-stretch items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-[28px] py-[10px]">
            <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-nowrap whitespace-pre text-gray-900 not-italic">
              Policzono
            </p>
          </div>
        </div>
      </div>

      <div className="relative box-border flex w-[613px] shrink-0 flex-col content-stretch items-start gap-2.5 bg-gray-900 px-[19px] py-[24px]">
        <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[17px]">
          <p className="relative w-full shrink-0 font-['Roboto_Flex:Bold',sans-serif] text-[24px] leading-[normal] font-bold text-custom-green not-italic">
            Do podziału : {total}
          </p>
          <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px] font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-custom-green not-italic">
            {splits.map((split, index) => (
              <p key={index} className="relative w-full shrink-0">
                {split.name}: {split.amount}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative box-border flex w-[611px] shrink-0 content-stretch items-center justify-end gap-2.5 rounded-lg bg-gray-900 p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-gray-900"
        />
        <button
          onClick={onShare}
          className="relative box-border flex shrink-0 content-stretch items-center justify-center gap-2.5 rounded-lg bg-custom-green-dark px-[28px] py-[10px] transition-colors hover:bg-custom-green-darker"
        >
          <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-nowrap whitespace-pre text-gray-900 not-italic">
            Udostępnij
          </p>
          <CopyIcon />
        </button>
        .
      </div>
    </div>
  );
}
