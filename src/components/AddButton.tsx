interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative h-[39px] w-[104px] shrink-0 rounded-[8px] bg-[#57cbab] transition-colors hover:bg-[#48b89a]"
    >
      <div className="absolute top-[calc(50%+0.75px)] left-1/2 h-[2.5px] w-[22px] translate-x-[-50%] translate-y-[-50%] rounded-[8px] bg-black" />
      <div
        className="absolute top-[calc(50%+0.5px)] left-[calc(50%-0.25px)] flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))] translate-x-[-50%] translate-y-[-50%] items-center justify-center"
        style={
          {
            "--transform-inner-width": "24",
            "--transform-inner-height": "2.5",
          } as React.CSSProperties
        }
      >
        <div className="flex-none rotate-[90deg]">
          <div className="h-[2.5px] w-6 rounded-[8px] bg-black" />
        </div>
      </div>
    </button>
  );
}
