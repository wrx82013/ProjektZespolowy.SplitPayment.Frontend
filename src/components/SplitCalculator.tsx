"use client";

import { useState } from "react";
import BillItem from "./BillItem";
import HomieItem from "./HomieItem";
import AddButton from "./AddButton";
import CalculationResults from "./CalculationResults";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  amount: string;
  currency: string;
}

interface Homie {
  id: string;
  name: string;
  contact: string;
}

interface Split {
  name: string;
  amount: string;
}

interface SplitCalculatorProps {
  onNavigateToPayment: () => void;
  onSaveCalculation?: (calculation: {
    title: string;
    items: Item[];
    homies: Homie[];
    total: string;
  }) => void;
  initialData?: {
    title: string;
    items: Item[];
    homies: Homie[];
  };
  mainCurrency?: string;
  exchangeRates?: Record<string, number>;
}

const mockData = {
  title: "Enter name of the bill you want to split",
  items: [
      { id: "1", name: "VPS AWS bill", amount: "12", currency: "USD" },
      { id: "2", name: "Vecel", amount: "12", currency: "PLN" },
      {
        id: "3",
        name: "Cost of VPS for college project",
        amount: "12",
        currency: "PLN",
      },
    ],
    homies: [
      { id: "1", name: "Karol Wojtowicz", contact: "+48 123 456 789" },
      {
        id: "2",
        name: "Grzegorz Kaczmarek",
        contact: "kaczmarekgrzegorz11@gmail.com",
      },
      { id: "3", name: "Nikodem Biryło", contact: "" },
      { id: "4", name: "Maciej Dorynek", contact: "" },
    ]
}

export default function SplitCalculator({
  onNavigateToPayment,
  onSaveCalculation,
  initialData,
  mainCurrency = "PLN",
  exchangeRates = { PLN: 1, USD: 4, EUR: 4.5, GBP: 5 },
}: SplitCalculatorProps) {
  const [billTitle, setBillTitle] = useState(
    initialData?.title || mockData.title,
  );
  const [items, setItems] = useState<Item[]>(
    initialData?.items || mockData.items,
  );
  const [homies, setHomies] = useState<Homie[]>(
    initialData?.homies || mockData.homies,
  );
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState<{
    total: string;
    splits: Split[];
  }>({ total: "", splits: [] });

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", amount: "", currency: "PLN" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateHomie = (id: string, field: keyof Homie, value: string) => {
    setHomies(
      homies.map((homie) =>
        homie.id === id ? { ...homie, [field]: value } : homie,
      ),
    );
  };

  const calculateSplit = () => {
    // Convert all amounts to main currency using provided exchange rates
    const totalInMainCurrency = items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const rate = exchangeRates[item.currency] || 1;
      return sum + amount * rate;
    }, 0);

    const homiesWithNames = homies.filter((h) => h.name.trim() !== "");
    const perPerson = totalInMainCurrency / homiesWithNames.length;

    const splits = homiesWithNames.map((homie) => ({
      name: homie.name,
      amount: `${perPerson.toFixed(2)} ${mainCurrency}`,
    }));

    const total = `${totalInMainCurrency.toFixed(1)} ${mainCurrency}`;

    setCalculationResult({
      total,
      splits,
    });
    setIsCalculated(true);

    // Save to history
    if (onSaveCalculation) {
      onSaveCalculation({
        title: billTitle,
        items: [...items],
        homies: [...homies],
        total,
      });
    }
  };

  const handleShare = () => {
    /**
     * TODO: Connect with BE
     * Upload final calculation
     */
    const shareableLink = `${window.location.origin}/split/${Date.now()}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success("Skopiowano link", {
      duration: 3000,
    });
  };

  const handlePay = () => {
    onNavigateToPayment();
  };

  return (
    <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-4 py-5">
      {/* Title */}
      <div className="relative flex w-full shrink-0 content-stretch items-center justify-between">
        <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-[56px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
          What are you spliting?
        </p>
      </div>

      {/* Bill Title Input */}
      <div className="relative w-full shrink-0 rounded-2">
        <div className="flex size-full flex-row items-center rounded-2">
          <div className="relative box-border flex w-full content-stretch items-center gap-2.5 p-2.5">
            <input
              type="text"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              className="w-full bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-2xl text-black not-italic outline-none"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[15px]">
        <p className="relative w-full shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-[24px] leading-[normal] font-normal text-black not-italic">
          Items
        </p>
        <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[12px]">
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
          <div className="relative flex w-full shrink-0 content-stretch items-center gap-4">
            <div className="relative box-border flex w-[492px] shrink-0 content-stretch items-center gap-2.5 rounded-[8px] p-[10px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
              />
              <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif] font-normal text-nowrap whitespace-pre text-[rgba(0,0,0,0.5)] not-italic">
                Enter more items
              </p>
            </div>
            <AddButton onClick={addItem} />
          </div>
        </div>
      </div>

      {/* Homies Section */}
      <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-[15px]">
        <p className="relative w-full shrink-0 font-['Roboto_Flex:Regular',sans-serif] text-[24px] leading-[normal] font-normal text-black not-italic">
          Homies
        </p>
        <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-3">
          {homies.map((homie) => (
            <HomieItem
              key={homie.id}
              name={homie.name}
              contact={homie.contact}
              onNameChange={(value) => updateHomie(homie.id, "name", value)}
              onContactChange={(value) =>
                updateHomie(homie.id, "contact", value)
              }
            />
          ))}
        </div>
      </div>

      {/* Calculate Button or Results */}
      {!isCalculated ? (
        <div className="relative w-full shrink-0 rounded-xl bg-black">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
          />
          <div className="flex size-full flex-row items-center">
            <div className="relative box-border flex w-full content-stretch items-center justify-between p-[10px]">
              <div className="relative flex shrink-0 content-stretch items-center justify-center gap-[10px]">
                <p className="relative shrink-0 font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-nowrap whitespace-pre text-[#57cbab] not-italic">
                  Suma
                </p>
              </div>
              <div className="relative flex shrink-0 content-stretch items-center justify-end gap-[32px]">
                <p className="relative shrink-0 text-right font-['Roboto_Flex:Bold',sans-serif]  leading-[normal] font-bold text-[#57cbab] not-italic">
                  -- PLN
                </p>
                <button
                  onClick={calculateSplit}
                  className="relative box-border flex shrink-0 content-stretch items-center justify-center gap-[10px] rounded-[8px] bg-[#57cbab] px-[28px] py-[10px] transition-colors hover:bg-[#48b89a]"
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
        <CalculationResults
          total={calculationResult.total}
          splits={calculationResult.splits}
          onShare={handleShare}
          onPay={handlePay}
        />
      )}
    </div>
  );
}
