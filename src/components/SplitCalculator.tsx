"use client";

import { ChangeEvent, useRef, useState } from "react";
import BillItem from "./BillItem";
import HomieItem from "./HomieItem";
import AddButton from "./AddButton";
import CalculationResults from "./CalculationResults";
import { toast } from "sonner";
import {
  createSplitPayment,
  uploadReceipt,
  validateSplitPayment,
} from "@/lib/api";
import ReceiptDragDrop from "./ReceiptDragDrop";
import { addHistoryRequestId } from "@/lib/historyStorage";
import {
  CreateSplitPaymentRequestDto,
  SplitPaymentResponseDto,
  SplitType,
  UserPaymentInputDto,
} from "@/types/api";

interface Item {
  id: string;
  name: string;
  amount: string;
  currency: string;
}

interface Homie {
  id: string;
  name: string;
  percentage: string;
  userEmail: string;
  isExcluded: boolean;
  excludedItemIds: string[];
}

export default function SplitCalculator() {
  const [billTitle, setBillTitle] = useState("The bill");
  const [items, setItems] = useState<Item[]>([]);
  const [homies, setHomies] = useState<Homie[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculationResult, setCalculationResult] =
    useState<SplitPaymentResponseDto | null>(null);
  const [manualPercentageOverrides, setManualPercentageOverrides] = useState(
    new Set<string>(),
  );
  const [isImporting, setIsImporting] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const exchangeRates = { PLN: 1, USD: 4, EUR: 4.5, GBP: 5 };

  const totalInMainCurrency = items.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    const rate =
      exchangeRates[item.currency as "PLN" | "USD" | "EUR" | "GBP"] || 1;
    return sum + amount * rate;
  }, 0);

  const activeHomies = homies.filter((homie) => !homie.isExcluded);
  const activeHomiesCount = activeHomies.length;
  const defaultPercentagePlaceholder =
    activeHomiesCount > 0 ? (100 / activeHomiesCount).toFixed(2) : "100";

  // Calculate total percentage
  const totalPercentage = activeHomies.reduce((sum, homie) => {
    const value = parseFloat(homie.percentage);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const percentageWarning =
    activeHomiesCount > 0 && Math.abs(totalPercentage - 100) > 0.01
      ? totalPercentage > 100
        ? `Uwaga: Suma procentów wynosi ${totalPercentage.toFixed(2)}% (przekracza 100%)`
        : `Uwaga: Suma procentów wynosi ${totalPercentage.toFixed(2)}% (brakuje ${(100 - totalPercentage).toFixed(2)}%)`
      : null;

  const canCalculate = items.length > 0 && activeHomiesCount > 0;

  const recalculatePercentages = (
    homiesList: Homie[],
    manualOverrides: Set<string>,
  ) => {
    const activeHomies = homiesList.filter((homie) => !homie.isExcluded);

    // If no active homies, everyone gets 0%
    if (activeHomies.length === 0) {
      return homiesList.map((homie) => ({
        ...homie,
        percentage: "0",
      }));
    }

    // Calculate sum of manual percentages
    const manualPercentageSum = activeHomies.reduce((sum, homie) => {
      if (!manualOverrides.has(homie.id)) {
        return sum;
      }
      const value = parseFloat(homie.percentage);
      return sum + (isNaN(value) ? 0 : Math.max(0, value));
    }, 0);

    // Get homies with automatic percentages
    const autoHomies = activeHomies.filter(
      (homie) => !manualOverrides.has(homie.id),
    );

    // Calculate remaining percentage for auto homies
    const remainingPercentage = Math.max(0, 100 - manualPercentageSum);

    // Calculate auto percentage per homie
    let autoPercentage = 0;
    if (autoHomies.length > 0) {
      autoPercentage = remainingPercentage / autoHomies.length;
    }

    return homiesList.map((homie) => {
      // Excluded homies always get 0%
      if (homie.isExcluded) {
        return { ...homie, percentage: "0" };
      }

      // Manual percentages are preserved
      if (manualOverrides.has(homie.id)) {
        const value = parseFloat(homie.percentage);
        // Ensure manual values are non-negative
        if (isNaN(value) || value < 0) {
          return { ...homie, percentage: "0" };
        }
        return homie;
      }

      // Auto-calculated percentages
      return { ...homie, percentage: autoPercentage.toFixed(2) };
    });
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", amount: "", currency: "PLN" },
    ]);
  };

  const addHomie = () => {
    const newHomieId = Date.now().toString();
    const newHomiesList = [
      ...homies,
      {
        id: newHomieId,
        name: "",
        percentage: "",
        userEmail: "",
        isExcluded: false,
        excludedItemIds: [],
      },
    ];
    const recalculatedHomies = recalculatePercentages(
      newHomiesList,
      manualPercentageOverrides,
    );
    setHomies(recalculatedHomies);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setHomies((prev) =>
      prev.map((homie) => ({
        ...homie,
        excludedItemIds: homie.excludedItemIds.filter((itemId) => itemId !== id),
      })),
    );
  };

  const removeHomie = (id: string) => {
    // Remove the homie from manual overrides
    const newOverrides = new Set(manualPercentageOverrides);
    newOverrides.delete(id);

    // Filter out the removed homie
    const newHomiesList = homies.filter((homie) => homie.id !== id);

    // Recalculate percentages for remaining homies
    const recalculatedHomies = recalculatePercentages(
      newHomiesList,
      newOverrides,
    );

    setManualPercentageOverrides(newOverrides);
    setHomies(recalculatedHomies);
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  type HomieEditableField = "name" | "percentage" | "userEmail";

  const updateHomie = (id: string, field: HomieEditableField, value: string) => {
    if (field === "percentage") {
      const newOverrides = new Set(manualPercentageOverrides);
      const trimmedValue = value.trim();

      // If empty, remove from manual overrides (will be auto-calculated)
      if (trimmedValue === "") {
        newOverrides.delete(id);
        const updatedHomies = homies.map((homie) =>
          homie.id === id ? { ...homie, percentage: "" } : homie,
        );
        const recalculatedHomies = recalculatePercentages(
          updatedHomies,
          newOverrides,
        );
        setManualPercentageOverrides(newOverrides);
        setHomies(recalculatedHomies);
        return;
      }

      // Add to manual overrides (allow typing even if not a valid number yet)
      newOverrides.add(id);

      // Update the homie with the new value
      const updatedHomies = homies.map((homie) =>
        homie.id === id ? { ...homie, percentage: value } : homie,
      );

      // Recalculate other homies
      const recalculatedHomies = recalculatePercentages(
        updatedHomies,
        newOverrides,
      );

      setManualPercentageOverrides(newOverrides);
      setHomies(recalculatedHomies);
      return;
    }

    setHomies(
      homies.map((homie) =>
        homie.id === id ? { ...homie, [field]: value } : homie,
      ),
    );
  };

  const toggleHomieExclusion = (id: string) => {
    const newOverrides = new Set(manualPercentageOverrides);
    const targetHomie = homies.find((h) => h.id === id);

    if (!targetHomie) return;

    const willBeExcluded = !targetHomie.isExcluded;

    // When excluding, remove from manual overrides
    if (willBeExcluded) {
      newOverrides.delete(id);
    }
    // When including back, also remove from overrides (will be auto-calculated)
    else {
      newOverrides.delete(id);
    }

    const updatedHomies = homies.map((homie) => {
      if (homie.id !== id) {
        return homie;
      }

      return {
        ...homie,
        isExcluded: willBeExcluded,
        percentage: willBeExcluded ? "0" : "",
      };
    });

    const recalculatedHomies = recalculatePercentages(
      updatedHomies,
      newOverrides,
    );
    setManualPercentageOverrides(newOverrides);
    setHomies(recalculatedHomies);
  };

  const toggleHomieItemParticipation = (homieId: string, itemId: string) => {
    setHomies((prev) =>
      prev.map((homie) => {
        if (homie.id !== homieId) return homie;

        const excluded = new Set(homie.excludedItemIds);
        if (excluded.has(itemId)) {
          excluded.delete(itemId);
        } else {
          excluded.add(itemId);
        }

        return { ...homie, excludedItemIds: Array.from(excluded) };
      }),
    );
  };

  const handleReceiptFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await uploadReceipt(file);
      const importedItems = result.items.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount.toString(),
        currency: item.currency,
      }));

      setItems((prev) => [...prev, ...importedItems]);
      toast.success("Dodano pozycje z rachunku", { duration: 2500 });
    } catch (error: any) {
      toast.error(error.message || "Nie udało się odczytać rachunku", {
        duration: 3000,
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const triggerReceiptUpload = () => {
    receiptInputRef.current?.click();
  };

  const handleReceiptFileDrop = async (file: File) => {
    setIsImporting(true);
    try {
      const result = await uploadReceipt(file);
      const importedItems = result.items.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount.toString(),
        currency: item.currency,
      }));
      setItems((prev) => [...prev, ...importedItems]);
      toast.success("Dodano pozycje z rachunku (drop)", { duration: 2500 });
    } catch (error: any) {
      toast.error(error.message || "Nie udało się odczytać rachunku", {
        duration: 3000,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const calculateSplit = async () => {
    const payloadItems = items
      .map((item, index) => ({
        id: item.id,
        name: item.name || `Item ${index + 1}`,
        amount: parseFloat(item.amount) || 0,
        currency: item.currency,
      }))
      .filter((item) => item.amount > 0);

    const users: UserPaymentInputDto[] = homies.map((homie) => ({
      userId: homie.id,
      userName: homie.name,
      userEmail: homie.userEmail,
      isExcluded: homie.isExcluded,
      percentage: homie.isExcluded
        ? 0
        : parseFloat(homie.percentage) || 0,
      excludedItemIds: homie.excludedItemIds,
    }));

    const requestData: CreateSplitPaymentRequestDto = {
      totalAmount: totalInMainCurrency,
      currency: "PLN",
      splitType: SplitType.Percentage,
      description: billTitle,
      users,
      items: payloadItems,
    };

    try {
      await validateSplitPayment(requestData);
    } catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      });
      return;
    }

    try {
      const result = await createSplitPayment(requestData);
      setCalculationResult(result);
      setIsCalculated(true);
      addHistoryRequestId(result.requestId);
      toast.success("Calculation successful!", {
        duration: 3000,
      });
    } catch (error: any) {
      toast.error(error.message, {
        duration: 3000,
      });
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[612px] flex-col items-start gap-5 px-2 sm:px-4 py-5">
      {/* Title */}
      <div className="relative flex w-full shrink-0 items-center justify-between">
        <p className="relative font-['Roboto_Flex:Regular',sans-serif] text-2xl sm:text-4xl md:text-[56px] leading-[normal] font-normal text-black not-italic">
          What are you spliting?
        </p>
      </div>

      {/* Bill Title Input */}
      <div className="relative w-full shrink-0 rounded-lg">
        <div className="flex size-full flex-row items-center rounded-lg">
          <div className="relative box-border flex w-full items-center gap-2.5 p-2.5">
            <input
              type="text"
              placeholder="Enter split title"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-2xl text-black not-italic outline-none"
            />
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={receiptInputRef}
        className="hidden"
        accept="image/*,.pdf,.txt"
        onChange={handleReceiptFileChange}
      />

      {/* Drag & Drop Receipt */}
      <ReceiptDragDrop onFileDropped={handleReceiptFileDrop} />

      {/* Items Section */}
      <div className="flex w-full shrink-0 flex-col items-start gap-3.5">
        <p className="w-full shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-2xl text-black">
          Items
        </p>
        <div className="flex w-full shrink-0 flex-col items-start gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex w-full items-center gap-2">
              <BillItem
                name={item.name}
                amount={item.amount}
                currency={item.currency}
                onNameChange={(value) => updateItem(item.id, "name", value)}
                onAmountChange={(value) => updateItem(item.id, "amount", value)}
                onCurrencyChange={(value) =>
                  updateItem(item.id, "currency", value)
                }
                availableCurrencies={Object.keys(exchangeRates)}
                onRemove={() => removeItem(item.id)}
              />
            </div>
          ))}
          {/* Add Item Row */}
          <div className="flex w-full shrink-0 items-center gap-2 sm:gap-4 justify-between">
            <p className="flex-1 min-w-0 font-['Roboto_Flex:Regular',sans-serif] not-italic bg-slate-200 rounded-lg p-2 truncate">
              Enter more items
            </p>
            <AddButton onClick={addItem} data-testid="add-button-items" />
          </div>
        </div>
      </div>

      {/* Homies Section */}
      <div className="flex w-full shrink-0 flex-col items-start gap-3.5">
        <p className="w-full shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-2xl text-black">
          Homies
        </p>
        <div className="flex w-full shrink-0 flex-col items-start gap-3">
          {homies.map((homie) => (
            <div key={homie.id} className="flex w-full items-center gap-2">
              <HomieItem
                name={homie.name}
                email={homie.userEmail}
                percentage={homie.percentage}
                isExcluded={homie.isExcluded}
                items={items}
                excludedItemIds={homie.excludedItemIds}
                onNameChange={(value) => updateHomie(homie.id, "name", value)}
                onEmailChange={(value) =>
                  updateHomie(homie.id, "userEmail", value)
                }
                onPercentageChange={(value) =>
                  updateHomie(homie.id, "percentage", value)
                }
                onToggleExclude={() => toggleHomieExclusion(homie.id)}
                onToggleItemParticipation={(itemId) =>
                  toggleHomieItemParticipation(homie.id, itemId)
                }
                placeholder={
                  homie.isExcluded ? "0" : defaultPercentagePlaceholder
                }
                removeHomie={() => removeHomie(homie.id)}
              />
            </div>
          ))}
          {/* Add Homie Row */}
          <div className="flex w-full shrink-0 items-center gap-2 sm:gap-4 justify-between">
            <p className="flex-1 min-w-0 font-['Roboto_Flex:Regular',sans-serif] not-italic bg-slate-200 rounded-lg p-2 truncate">
              Enter more homies
            </p>
            <AddButton onClick={addHomie} data-testid="add-button-homies" />
          </div>
        </div>
      </div>

      {/* Percentage Warning */}
      {percentageWarning && (
        <div
          className={`w-full rounded-lg p-3 ${
            totalPercentage > 100
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-yellow-100 border border-yellow-400 text-yellow-700"
          }`}
        >
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-sm">
            {percentageWarning}
          </p>
        </div>
      )}

      {/* Calculate Button or Results */}
      {!isCalculated ? (
        <div className="relative w-full shrink-0 bg-black rounded-xl border border-solid border-black">
          <div className="flex size-full flex-col sm:flex-row items-stretch sm:items-center">
            <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 p-3 sm:p-2">
              <div className="flex items-center justify-between sm:justify-center gap-2.5">
                <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
                  Suma
                </p>
                <p className="sm:hidden text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
                  {totalInMainCurrency.toFixed(2) || "--"} PLN
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-8">
                <p className="hidden sm:block text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
                  {totalInMainCurrency.toFixed(2) || "--"} PLN
                </p>
                <button
                  onClick={calculateSplit}
                  disabled={!canCalculate}
                  className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green px-5 sm:px-7 py-2.5 transition-colors hover:bg-custom-green-hover disabled:bg-gray-400"
                  title={
                    !canCalculate
                      ? "Add at least one item and one participating homie to calculate the split"
                      : ""
                  }
                >
                  <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif] leading-[normal] font-bold text-black not-italic">
                    Oblicz
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        calculationResult && (
          <CalculationResults
            total={`${calculationResult.totalAmount} ${calculationResult.currency}`}
            splits={
              calculationResult.userPayments?.map((p) => ({
                name: p.userName || "Unnamed",
                amount: `${p.amount.toFixed(2)} ${calculationResult.currency}`,
              })) || []
            }
            onShare={() => {
              if (calculationResult.paymentUrl) {
                navigator.permissions.query({ name: "clipboard-write" as any }).then((result) => {
                if (result.state === "granted" || result.state === "prompt") {
                  navigator.clipboard.writeText(calculationResult.paymentUrl ?? "");
                  toast.success("Skopiowano link do płatności", {
                    duration: 3000,
                  });
                } else {
                  toast.error("Nie udało się skopiować linku do płatności", {
                    duration: 3000,
                  });
                }
              });

              }
            }}
            paymentUrl={calculationResult.paymentUrl}
          />
        )
      )}
    </div>
  );
}
