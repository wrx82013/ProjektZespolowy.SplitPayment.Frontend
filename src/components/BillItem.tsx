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
    <div className="flex w-full shrink-0 content-stretch items-center gap-4">
      <div className="relative box-border flex w-[492px] shrink-0 content-stretch items-center gap-2.5 rounded-xl p-2.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter item name"
          className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif] font-normal text-black not-italic outline-none"
        />
      </div>
      <div className="relative box-border flex w-[104px] shrink-0 content-stretch items-center justify-between rounded-xl p-2.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="w-10 bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
        />
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-[rgba(0,0,0,0.5)] not-italic outline-none"
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
