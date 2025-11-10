"use client";

import SplitCalculator from "@/components/SplitCalculator";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function CalculatorPage() {
  const {
    editingCalculation,
    handleSaveCalculation,
    settings,
    // setEditingCalculation,
  } = useAppContext();
  const router = useRouter();

  const handleNavigateToPayment = () => {
    router.push("/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SplitCalculator />
    </div>
  );
}
