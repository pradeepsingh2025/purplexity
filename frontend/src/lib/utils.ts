import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
export { uid, clamp };