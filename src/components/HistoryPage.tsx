import HistoryItem from "./HistoryItem";
import Cmondosomething from "../../public/assets/cmondosomething.png";

export interface Calculation {
  id: string;
  title: string;
  items: Array<{ name: string; amount: string; currency: string }>;
  homies: Array<{ name: string; contact: string }>;
  total: string;
  timestamp: number;
}

interface HistoryPageProps {
  calculations: Calculation[];
  onEdit: (calculation: Calculation) => void;
  onDelete: (id: string) => void;
  // onNavigateToSplit: () => void;
}

export default function HistoryPage({
  calculations,
  onEdit,
  onDelete,
  // onNavigateToSplit,
}: HistoryPageProps) {
  const isEmpty = calculations.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-4 py-5">
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-[56px] leading-[normal] font-normal text-black not-italic">
            History
          </p>

          {isEmpty ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-8 h-[307px] w-[265px]">
                <img
                  alt="No calculations yet"
                  className="size-full max-w-none object-cover"
                  src={Cmondosomething.src}
                />
              </div>
              <p className="text-center font-['Roboto_Flex:Regular',sans-serif] text-[28px] leading-[normal] font-normal text-black not-italic">
                You didn&apos;t split any bills just yet..
              </p>
            </div>
          ) : (
            /* List of calculations */
            <div className="flex w-full max-w-[650px] flex-col content-stretch items-start gap-3">
              {calculations.map((calc) => (
                <HistoryItem
                  key={calc.id}
                  title={calc.title}
                  onEdit={() => onEdit(calc)}
                  onDelete={() => onDelete(calc.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
