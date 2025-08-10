import { AgeMod } from "@/app/types";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export function labelOf(mod: AgeMod): string {
  return mod === "min" ? "분" : mod === "hr" ? "시" : "일";
}
