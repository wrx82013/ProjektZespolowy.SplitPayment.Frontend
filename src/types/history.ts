export interface HistoryItemEntry {
  id: string;
  name: string;
  amount: string;
  currency: string;
}

export interface HistoryHomie {
  id: string;
  name: string;
  contact: string;
  percentage?: string;
  isExcluded?: boolean;
}

export interface HistoryCalculation {
  id: string;
  title: string;
  items: HistoryItemEntry[];
  homies: HistoryHomie[];
  total: string;
  timestamp: number;
}
