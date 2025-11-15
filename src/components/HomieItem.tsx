import DeleteButton from "./DeleteButton";

interface HomieItemProps {
  name: string;
  email: string;
  percentage: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPercentageChange: (value: string) => void;
  removeHomie: () => void;
  placeholder: string;
}

export default function HomieItem({
  name,
  email,
  percentage,
  onNameChange,
  onEmailChange,
  onPercentageChange,
  placeholder,
  removeHomie,
}: HomieItemProps) {
  return (
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
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={percentage}
          onChange={(e) => onPercentageChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 sm:flex-none bg-transparent text-right font-['Roboto_Flex:Regular',sans-serif] text-black outline-none box-border flex w-full sm:w-20 items-center justify-end gap-2.5 rounded-lg p-2.5 border border-solid border-black"
        />
        <span className="text-black shrink-0">%</span>
        <DeleteButton onClick={removeHomie} />
      </div>
    </div>
  );
}
