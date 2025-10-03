type StorageValue = string | null;

interface StorageAdapter {
  getItem: (key: string) => Promise<StorageValue>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const createWebStorage = (): StorageAdapter | null => {
  const maybeGlobal = typeof globalThis !== 'undefined' ? (globalThis as any) : null;
  const localStorage = maybeGlobal?.localStorage;

  if (!localStorage) {
    return null;
  }

  return {
    getItem: async (key) => localStorage.getItem(key),
    setItem: async (key, value) => {
      localStorage.setItem(key, value);
    },
    removeItem: async (key) => {
      localStorage.removeItem(key);
    },
  };
};

const createMemoryStorage = (): StorageAdapter => {
  const memory = new Map<string, string>();

  return {
    getItem: async (key) => memory.get(key) ?? null,
    setItem: async (key, value) => {
      memory.set(key, value);
    },
    removeItem: async (key) => {
      memory.delete(key);
    },
  };
};

const storage = createWebStorage() ?? createMemoryStorage();

export default storage;
