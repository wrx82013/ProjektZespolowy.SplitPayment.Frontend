"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import HistoryPage from "@/components/HistoryPage";
import { getSplitPayment } from "@/lib/api";
import {
  getHistoryRequestIds,
  removeHistoryRequestId,
} from "@/lib/historyStorage";
import { SplitPaymentResponseDto } from "@/types/api";

export default function History() {
  const [entries, setEntries] = useState<SplitPaymentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    const ids = getHistoryRequestIds();

    if (ids.length === 0) {
      setEntries([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const failedIds: string[] = [];

    try {
      const responses = await Promise.all(
        ids.map(async (id) => {
          try {
            const payment = await getSplitPayment(id);
            return payment;
          } catch (err) {
            failedIds.push(id);
            console.error(`Failed to fetch history entry ${id}`, err);
            return null;
          }
        }),
      );

      const successful = responses.filter(
        (entry): entry is SplitPaymentResponseDto => entry !== null,
      );

      setEntries(successful);

      if (failedIds.length > 0) {
        setError(
          `Unable to load ${failedIds.length} entr${
            failedIds.length === 1 ? "y" : "ies"
          }. Try refreshing.`,
        );
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
      setEntries([]);
      setError("Failed to load history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const handleRemove = (requestId: string) => {
    removeHistoryRequestId(requestId);
    setEntries((prev) =>
      prev.filter((entry) => entry.requestId !== requestId),
    );
    toast.success("Entry removed from history");
  };

  return (
    <HistoryPage
      entries={entries}
      isLoading={isLoading}
      error={error}
      onRemove={handleRemove}
      onRefresh={() => void fetchEntries()}
    />
  );
}
