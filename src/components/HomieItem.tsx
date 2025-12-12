import DeleteButton from "./DeleteButton";

interface HomieItemProps {
  name: string;
  email: string;
  percentage: string;
  isExcluded: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPercentageChange: (value: string) => void;
  onToggleExclude: () => void;
  removeHomie: () => void;
  placeholder: string;
}

export default function HomieItem({
  name,
  email,
  percentage,
  isExcluded,
  onNameChange,
  onEmailChange,
  onPercentageChange,
  onToggleExclude,
  placeholder,
  removeHomie,
}: HomieItemProps) {
  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-lg border border-solid border-black p-3 ${isExcluded ? "bg-gray-50" : ""}`}
    >
      <div className="flex flex-col sm:flex-row w-full shrink-0 content-stretch items-stretch sm:items-center gap-2 sm:gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter name"
          className="bg-transparent font-['Roboto_Flex:Regular',sans-serif] text-black outline-none box-border flex w-full sm:w-auto sm:flex-1 items-center gap-2.5 rounded-lg p-2.5 border border-solid border-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter email"
          className="bg-transparent font-['Roboto_Flex:Regular',sans-serif] text-black not-italic outline-none box-border flex w-full sm:w-auto sm:flex-1 items-center gap-2.5 rounded-lg p-2.5 inset-0 border border-solid border-black"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <input
            type="number"
            value={isExcluded ? "0" : percentage}
            onChange={(e) => onPercentageChange(e.target.value)}
            placeholder={placeholder}
            disabled={isExcluded}
            className="flex-1 sm:flex-none bg-transparent text-right font-['Roboto_Flex:Regular',sans-serif] text-black outline-none box-border flex w-full sm:w-20 items-center justify-end gap-2.5 rounded-lg p-2.5 border border-solid border-black disabled:bg-gray-100 disabled:text-gray-500"
          />
          <span className="text-black shrink-0">%</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onToggleExclude}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isExcluded ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-custom-green text-black hover:bg-custom-green-hover"}`}
          >
            {isExcluded ? "Include in bill" : "Skip from bill"}
          </button>
          <DeleteButton onClick={removeHomie} />
        </div>
      </div>
      {isExcluded && (
        <p className="text-xs text-gray-500">
          This friend will stay at 0% and be excluded from the split total.
        </p>
      )}
    </div>
  );
}
