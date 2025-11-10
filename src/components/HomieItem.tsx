interface HomieItemProps {
  name: string;
  percentage: string;
  onNameChange: (value: string) => void;
  onPercentageChange: (value: string) => void;
  placeholder: string;
}

export default function HomieItem({
  name,
  percentage,
  onNameChange,
  onPercentageChange,
  placeholder,
}: HomieItemProps) {
  return (
    <div className="relative flex w-full shrink-0 content-stretch items-center gap-2.5">
      <div className="relative box-border flex w-[304px] shrink-0 content-stretch items-center gap-2.5 rounded-lg p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-black"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter name"
          className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
        />
      </div>
      <div className="relative box-border flex w-[298px] shrink-0 content-stretch items-center justify-end gap-2.5 rounded-lg p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-black"
        />
        <input
          type="number"
          value={percentage}
          onChange={(e) => onPercentageChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-right font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
        />
        <span className="text-black">%</span>
      </div>
    </div>
  );
}
