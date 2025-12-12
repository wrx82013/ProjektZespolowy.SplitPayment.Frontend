import DeleteButton from "./DeleteButton";

interface BillItemProps {
  name: string;
  amount: string;
  currency: string;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  availableCurrencies?: string[];
  onRemove: () => void;
}

export default function BillItem({
  name,
  amount,
  currency,
  onNameChange,
  onAmountChange,
  onCurrencyChange,
  availableCurrencies = ["PLN", "USD", "EUR", "GBP"],
  onRemove,
}: BillItemProps) {
  return (
    <div className="flex w-full shrink-0 content-stretch items-center gap-2 sm:gap-4">
      <div className="rounded-xl border border-solid border-black box-border flex flex-1 min-w-0 content-stretch items-center gap-2.5 p-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter item name"
          className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif] font-normal text-black not-italic outline-none"
        />
      </div>
      <div className="relative box-border flex w-32 sm:w-40 shrink-0 items-center gap-1 rounded-xl p-2.5 border border-solid border-black">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="flex-1 min-w-0 bg-transparent text-right font-['Roboto_Flex:Regular',sans-serif] leading-[normal] font-normal text-black not-italic outline-none"
        />
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-transparent font-['Roboto_Flex:Regular',sans-serif] leading-[normal] font-normal text-[rgba(0,0,0,0.5)] not-italic outline-none text-xs sm:text-sm w-12 appearance-none pr-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='rgba(0,0,0,0.5)' d='M0 0l5 5 5-5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: '10px 6px'
          }}
        >
          {availableCurrencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
      <DeleteButton onClick={onRemove} />
    </div>
  );
}
