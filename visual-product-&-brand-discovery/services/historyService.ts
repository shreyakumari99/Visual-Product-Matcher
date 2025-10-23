import { HistoryItem } from '../types';

const HISTORY_KEY = 'visualProductDiscoveryHistory';

export const getHistory = (): HistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory) as HistoryItem[];
      // Sort by timestamp descending (newest first)
      return history.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    localStorage.removeItem(HISTORY_KEY); // Clear corrupted data
  }
  return [];
};

export const addHistoryItem = (item: HistoryItem): HistoryItem[] => {
  const currentHistory = getHistory();
  // Prepend new item and limit history size to 20 items to avoid bloating storage
  const updatedHistory = [item, ...currentHistory].slice(0, 20);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
  return updatedHistory;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage", error);
  }
};
