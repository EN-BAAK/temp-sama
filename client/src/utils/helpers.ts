import { BASE_URL } from "@/api-client";

export const setSessionItem = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    sessionStorage.setItem(key, data);
  } catch { }
};

export const getSessionItem = <T = unknown>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

export const clearSessionItem = (key: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
};

export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const handlePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;

  const sanitizedNumber = phoneNumber.replace(/\s|-/g, "");

  window.location.href = `tel:${sanitizedNumber}`;
};

export const formatBalance = (amount?: number | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "غير محدد";
  }

  if (amount <= 0) {
    return "0 ل.س";
  }

  if (amount >= 1_000_000_000) {
    const value = amount / 1_000_000_000;
    const formatted = Number(value.toFixed(2));
    return `${formatted} ${formatted === 1 ? "مليار" : "مليار"} ل.س`;
  }

  if (amount >= 1_000_000) {
    const value = amount / 1_000_000;
    const formatted = Number(value.toFixed(2));

    let label = "مليون";
    if (formatted >= 3 && formatted <= 10 && Number.isInteger(formatted)) {
      label = "ملايين";
    }

    return `${formatted} ${label} ل.س`;
  }

  if (amount >= 10_000) {
    const value = amount / 1_000;
    const formatted = Number(value.toFixed(2));

    let label = "ألف";
    if (formatted >= 3 && formatted <= 10 && Number.isInteger(formatted)) {
      label = "آلاف";
    }

    return `${formatted} ${label} ل.س`;
  }

  return `${amount.toLocaleString("ar-SY")} ل.س`;
};

export const getImageUrl = (imgUrl: string): string => {
  return `${BASE_URL}/${imgUrl}`
}

export const range = (end: number, step: number = 1, start: number = 0): number[] => {
  const numbers = []

  for (let i = start; i < end; i += step) {
    numbers.push(i)
    if (numbers.length >= 200) throw new Error("Our of memory");
  }


  return numbers
}