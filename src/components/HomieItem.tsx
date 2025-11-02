interface HomieItemProps {
  name: string;
  contact: string;
  onNameChange: (value: string) => void;
  onContactChange: (value: string) => void;
}

function DropdownIcon() {
  return (
    <div className="relative h-[17px] w-[21px] shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 21 17"
      >
        <g id="Frame 67">
          <path
            d="M3 4L11 13L19 4"
            id="Vector 2"
            stroke="var(--stroke-0, black)"
          />
        </g>
      </svg>
    </div>
  );
}

export default function HomieItem({
  name,
  contact,
  onNameChange,
  onContactChange,
}: HomieItemProps) {
  return (
    <div className="relative flex w-full shrink-0 content-stretch items-center gap-[10px]">
      <div className="relative box-border flex w-[304px] shrink-0 content-stretch items-center gap-[10px] rounded-[8px] p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[8px] border border-solid border-black"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter name"
          className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
        />
      </div>
      <div className="relative box-border flex w-[298px] shrink-0 content-stretch items-center justify-end gap-[10px] rounded-[8px] p-[10px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[8px] border border-solid border-black"
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => onContactChange(e.target.value)}
          placeholder="Contact info"
          className="flex-1 bg-transparent text-right font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
        />
        <DropdownIcon />
      </div>
    </div>
  );
}
