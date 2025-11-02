"use client";

import HistoryPage from "@/components/HistoryPage";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function History() {
  const { calculations, handleEditCalculation, handleDeleteCalculation } =
    useAppContext();
  const router = useRouter();

  const handleNavigateToSplit = () => {
    router.push("/calculator");
  };

  const handleEdit = (calculation) => {
    handleEditCalculation(calculation);
    router.push("/calculator");
  };

  return (
    <HistoryPage
      calculations={calculations}
      onEdit={handleEdit}
      onDelete={handleDeleteCalculation}
      onNavigateToSplit={handleNavigateToSplit}
    />
  );
}
