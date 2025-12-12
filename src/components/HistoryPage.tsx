import HistoryItem from "./HistoryItem";
import Cmondosomething from "../../public/assets/cmondosomething.png";
import { SplitPaymentResponseDto } from "@/types/api";

interface HistoryPageProps {
  entries: SplitPaymentResponseDto[];
  isLoading: boolean;
  error?: string | null;
  onRemove: (id: string) => void;
  onRefresh: () => void;
}

export default function HistoryPage({
  entries,
  isLoading,
  error,
  onRemove,
  onRefresh,
}: HistoryPageProps) {
  const isEmpty = !isLoading && entries.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-2 sm:px-4 py-5">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="font-['Roboto_Flex:Regular',sans-serif] text-3xl sm:text-4xl md:text-[56px] leading-[normal] font-normal text-black not-italic">
              History
            </p>
            <button
              className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              onClick={onRefresh}
            >
              Refresh
            </button>
          </div>

          {isLoading && (
            <div className="flex w-full items-center justify-center py-10">
              <p className="text-center font-['Roboto_Flex:Regular',sans-serif] text-lg text-gray-600">
                Fetching your split payment history...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="text-sm">
                {error}
              </p>
            </div>
          )}

          {isEmpty && !error && (
            <div className="flex w-full flex-col items-center justify-center py-10 sm:py-20">
              <div className="mb-6 sm:mb-8 h-[200px] w-[173px] sm:h-[307px] sm:w-[265px]">
                <img
                  alt="No history yet"
                  className="size-full max-w-none object-cover"
                  src={Cmondosomething.src}
                />
              </div>
              <p className="text-center font-['Roboto_Flex:Regular',sans-serif] text-xl sm:text-2xl md:text-[28px] leading-[normal] font-normal text-black not-italic px-4">
                You didn&apos;t split any bills just yet..
              </p>
            </div>
          )}

          {!isLoading && entries.length > 0 && (
            <div className="flex w-full flex-col content-stretch items-start gap-3">
              {entries.map((entry) => (
                <HistoryItem
                  key={entry.requestId}
                  entry={entry}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
