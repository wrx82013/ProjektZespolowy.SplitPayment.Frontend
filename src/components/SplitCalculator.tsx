"use client";

import { useState } from "react";
import BillItem from "./BillItem";
import HomieItem from "./HomieItem";
import AddButton from "./AddButton";
import CalculationResults from "./CalculationResults";
import { toast } from "sonner";
import { createSplitPayment, validateSplitPayment } from "@/lib/api";
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

  const exchangeRates = { PLN: 1, USD: 4, EUR: 4.5, GBP: 5 };

  const totalInMainCurrency = items.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    const rate =
      exchangeRates[item.currency as "PLN" | "USD" | "EUR" | "GBP"] || 1;
    return sum + amount * rate;
  }, 0);

  const recalculatePercentages = (
    homiesList: Homie[],
    manualOverrides: Set<string>,
  ) => {
    const autoHomies = homiesList.filter((h) => !manualOverrides.has(h.id));
    const manualHomies = homiesList.filter((h) => manualOverrides.has(h.id));

    const manualPercentageSum = manualHomies.reduce(
      (sum, h) => sum + (parseFloat(h.percentage) || 0),
      0,
    );

    if (autoHomies.length > 0) {
      const remainingPercentage = 100 - manualPercentageSum;
      const autoPercentage = remainingPercentage / autoHomies.length;

      autoHomies.forEach((h) => {
        h.percentage = autoPercentage.toFixed(2);
      });
    }

    return [...manualHomies, ...autoHomies];
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
      { id: newHomieId, name: "", percentage: "", userEmail: "" },
    ];
    const recalculatedHomies = recalculatePercentages(
      newHomiesList,
      manualPercentageOverrides,
    );
    setHomies(recalculatedHomies);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const removeHomie = (id: string) => {
    const newOverrides = new Set(manualPercentageOverrides);
    newOverrides.delete(id);
    setManualPercentageOverrides(newOverrides);

    const newHomiesList = homies.filter((homie) => homie.id !== id);
    const recalculatedHomies = recalculatePercentages(
      newHomiesList,
      newOverrides,
    );
    setHomies(recalculatedHomies);
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateHomie = (id: string, field: keyof Homie, value: string) => {
    if (field === "percentage") {
      const newOverrides = new Set(manualPercentageOverrides);
      newOverrides.add(id);
      setManualPercentageOverrides(newOverrides);
    }
    setHomies(
      homies.map((homie) =>
        homie.id === id ? { ...homie, [field]: value } : homie,
      ),
    );
  };

  const calculateSplit = async () => {
    const users: UserPaymentInputDto[] = homies.map((homie) => ({
      userId: homie.id,
      userName: homie.name,
      userEmail: homie.userEmail,
      percentage: parseFloat(homie.percentage) || null,
    }));

    const requestData: CreateSplitPaymentRequestDto = {
      totalAmount: totalInMainCurrency,
      currency: "PLN",
      splitType: SplitType.Percentage,
      description: billTitle,
      users: users,
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
    <div className="mx-auto flex w-full max-w-[612px] flex-col items-start gap-5 px-4 py-5">
      {/* Title */}
      <div className="relative flex w-full shrink-0 items-center justify-between">
        <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-[56px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
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
          <div className="flex w-full shrink-0 items-center gap-4 justify-between">
            <p className="shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-nowrap whitespace-pre not-italic bg-slate-200 w-full rounded-lg p-2">
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
                onNameChange={(value) => updateHomie(homie.id, "name", value)}
                onEmailChange={(value) =>
                  updateHomie(homie.id, "userEmail", value)
                }
                onPercentageChange={(value) =>
                  updateHomie(homie.id, "percentage", value)
                }
                placeholder={
                  homies.length > 0 ? (100 / homies.length).toFixed(2) : "100"
                }
                removeHomie={() => removeHomie(homie.id)}
              />
            </div>
          ))}
          {/* Add Homie Row */}
          <div className="flex w-full shrink-0 items-center gap-4">
            <div className="flex w-full shrink-0 items-center gap-4 justify-between">
              <p className="shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-nowrap whitespace-pre bg-slate-200 w-full rounded-lg p-2">
                Enter more homies
              </p>
            </div>
            <AddButton onClick={addHomie} data-testid="add-button-homies" />
          </div>
        </div>
      </div>

      {/* Calculate Button or Results */}
      {!isCalculated ? (
        <div className="relative w-full shrink-0 bg-black  rounded-xl border border-solid border-black">
          <div className="flex size-full flex-row items-center">
            <div className="flex w-full items-center justify-between p-2">
              <div className="flex items-center justify-center gap-2.5">
                <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-nowrap whitespace-pre text-custom-green">
                  Suma
                </p>
              </div>
              <div className="flex items-center justify-end gap-8">
                <p className="shrink-0 text-right font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green">
                  {totalInMainCurrency.toFixed(2) || "--"} PLN
                </p>
                <button
                  onClick={calculateSplit}
                  disabled={items.length === 0 || homies.length === 0}
                  className="flex items-center justify-center gap-2.5 rounded-lg bg-custom-green px-7 py-2.5 transition-colors hover:bg-custom-green-hover disabled:bg-gray-400"
                  title={
                    items.length === 0 || homies.length === 0
                      ? "Add at least one item and one homie to calculate the split"
                      : ""
                  }
                >
                  <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-nowrap whitespace-pre text-black not-italic">
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
                navigator.clipboard.writeText(calculationResult.paymentUrl);
                toast.success("Skopiowano link do płatności", {
                  duration: 3000,
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
