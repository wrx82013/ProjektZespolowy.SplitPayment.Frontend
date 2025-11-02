"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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

export interface Calculation {
  id: string;
  title: string;
  items: Item[];
  homies: Homie[];
  total: string;
  timestamp: number;
}

interface CurrencySettings {
  mainCurrency: string;
  exchangeRates: {
    [key: string]: number;
  };
}

interface AppContextType {
  calculations: Calculation[];
  settings: CurrencySettings;
  editingCalculation: Calculation | null;
  handleSaveCalculation: (data: {
    title: string;
    items: Item[];
    homies: Homie[];
    total: string;
  }) => void;
  handleEditCalculation: (calculation: Calculation) => void;
  handleDeleteCalculation: (id: string) => void;
  handleSettingsChange: (newSettings: CurrencySettings) => void;
  setEditingCalculation: (calculation: Calculation | null) => void;
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
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [editingCalculation, setEditingCalculation] =
    useState<Calculation | null>(null);
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
  const handleSaveCalculation = (data: {
    title: string;
    items: Item[];
    homies: Homie[];
    total: string;
  }) => {
    if (editingCalculation) {
      setCalculations(
        calculations.map((calc) =>
          calc.id === editingCalculation.id
            ? { ...calc, ...data, timestamp: Date.now() }
            : calc,
        ),
      );
      setEditingCalculation(null);
      toast.success("Calculation updated!");
    } else {
      const newCalculation: Calculation = {
        id: Date.now().toString(),
        ...data,
        timestamp: Date.now(),
      };
      setCalculations([newCalculation, ...calculations]);
      toast.success("Calculation saved to history!");
    }
  };

  const handleEditCalculation = (calculation: Calculation) => {
    setEditingCalculation(calculation);
  };

  const handleDeleteCalculation = (id: string) => {
    setCalculations(calculations.filter((calc) => calc.id !== id));
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
