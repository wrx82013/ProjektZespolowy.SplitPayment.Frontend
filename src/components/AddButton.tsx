interface AddButtonProps {
  onClick: () => void;
  "data-testid"?: string;
}

export default function AddButton({
  onClick,
  "data-testid": dataTestId,
}: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      data-testid={dataTestId || "add-button"}
      className="h-8 w-24 shrink-0 rounded-lg bg-custom-green cursor-pointer transition-colors hover:bg-custom-green-dark flex items-center justify-center"
    >
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="11" width="22" height="2.5" rx="1.25" fill="black" />
        <rect
          x="12"
          width="24"
          height="2.5"
          rx="1.25"
          transform="rotate(90 12 0)"
          fill="black"
        />
      </svg>
    </button>
  );
}
