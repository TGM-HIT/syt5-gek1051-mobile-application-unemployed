// src/lib/localdb.ts
export const openDB = async () => {
    return {
      put: async (entry: any) => {
        const items = JSON.parse(localStorage.getItem("entries") || "[]");
        localStorage.setItem("entries", JSON.stringify([...items, entry]));
      },
      getAll: async () => {
        return JSON.parse(localStorage.getItem("entries") || "[]");
      },
    };
  };
  