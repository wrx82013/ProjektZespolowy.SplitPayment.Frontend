const HISTORY_STORAGE_KEY = "splitpay_history_request_ids";

const isBrowser = () => typeof window !== "undefined";

const readStorage = (): string[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }
  } catch (error) {
    console.error("Failed to read history ids", error);
  }

  return [];
};

const writeStorage = (ids: string[]) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Failed to persist history ids", error);
  }
};

export const getHistoryRequestIds = (): string[] => readStorage();

export const addHistoryRequestId = (requestId: string) => {
  if (!requestId) {
    return;
  }

  const ids = readStorage().filter((id) => id !== requestId);
  ids.unshift(requestId);
  writeStorage(ids);
};

export const removeHistoryRequestId = (requestId: string) => {
  const ids = readStorage().filter((id) => id !== requestId);
  writeStorage(ids);
};

export const clearHistory = () => {
  writeStorage([]);
};
