"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  HistoryCalculation,
  HistoryHomie,
  HistoryItemEntry,
} from "@/types/history";
import {
  fetchHistoryCalculations,
  syncHistoryCalculations,
} from "@/lib/api";

interface CurrencySettings {
  mainCurrency: string;
  exchangeRates: {
    [key: string]: number;
  };
}

interface AppContextType {
  calculations: HistoryCalculation[];
  settings: CurrencySettings;
  editingCalculation: HistoryCalculation | null;
  handleSaveCalculation: (data: {
    title: string;
    items: HistoryItemEntry[];
    homies: HistoryHomie[];
    total: string;
  }) => void;
  handleEditCalculation: (calculation: HistoryCalculation) => void;
  handleDeleteCalculation: (id: string) => void;
  handleSettingsChange: (newSettings: CurrencySettings) => void;
  setEditingCalculation: (calculation: HistoryCalculation | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: CurrencySettings = {
  /**
   * TODO: Add fetching NBP exchange rates on app startup
   * https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json
   */
  mainCurrency: "PLN",
  exchangeRates: {
    USD: 0.27,
    PLN: 1,
    EUR: 0.23,
    GBP: 0.2,
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [calculations, setCalculations] = useState<HistoryCalculation[]>([]);
  const [editingCalculation, setEditingCalculation] =
    useState<HistoryCalculation | null>(null);
  const [settings, setSettings] = useState<CurrencySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("splitpay_calculations");
    if (saved) {
      try {
        setCalculations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load calculations", e);
      }
    }

    const loadServerHistory = async () => {
      try {
        const remoteCalculations = await fetchHistoryCalculations();
        setCalculations(remoteCalculations);
        localStorage.setItem(
          "splitpay_calculations",
          JSON.stringify(remoteCalculations),
        );
      } catch (error) {
        console.error("Failed to fetch history from server", error);
      }
    };

    void loadServerHistory();
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("splitpay_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("splitpay_calculations", JSON.stringify(calculations));
  }, [calculations]);

  useEffect(() => {
    localStorage.setItem("splitpay_settings", JSON.stringify(settings));
  }, [settings]);

  /**
   * TODO: Add debounce for 300-500ms
   * */
  const persistHistory = (list: HistoryCalculation[]) => {
    void syncHistoryCalculations(list).catch((error) => {
      console.error("Failed to sync history", error);
    });
  };

  const handleSaveCalculation = (data: {
    title: string;
    items: HistoryItemEntry[];
    homies: HistoryHomie[];
    total: string;
  }) => {
    if (editingCalculation) {
      const updatedCalculations = calculations.map((calc) =>
        calc.id === editingCalculation.id
          ? { ...calc, ...data, timestamp: Date.now() }
          : calc,
      );
      setCalculations(updatedCalculations);
      persistHistory(updatedCalculations);
      setEditingCalculation(null);
      toast.success("Calculation updated!");
    } else {
      const newCalculation: HistoryCalculation = {
        id: Date.now().toString(),
        ...data,
        timestamp: Date.now(),
      };
      const updatedCalculations = [newCalculation, ...calculations];
      setCalculations(updatedCalculations);
      persistHistory(updatedCalculations);
      toast.success("Calculation saved to history!");
    }
  };

  const handleEditCalculation = (calculation: HistoryCalculation) => {
    setEditingCalculation(calculation);
  };

  const handleDeleteCalculation = (id: string) => {
    const updatedCalculations = calculations.filter((calc) => calc.id !== id);
    setCalculations(updatedCalculations);
    persistHistory(updatedCalculations);
    toast.success("Calculation deleted!");
  };

  const handleSettingsChange = (newSettings: CurrencySettings) => {
    setSettings(newSettings);
    toast.success("Settings saved!");
  };

  return (
    <AppContext.Provider
      value={{
        calculations,
        settings,
        editingCalculation,
        handleSaveCalculation,
        handleEditCalculation,
        handleDeleteCalculation,
        handleSettingsChange,
        setEditingCalculation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
