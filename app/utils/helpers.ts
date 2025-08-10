import { AgeMod } from "@/app/types";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 기본 인풋 스타일 상수
export const INPUT_BASE_STYLES =
  "rounded-xl border px-3 py-2 outline-none focus:ring-4 ring-blue-100";
export const INPUT_ERROR_STYLES = "border-red-300";
export const INPUT_NORMAL_STYLES = "border-gray-300";

export function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export function labelOf(mod: AgeMod): string {
  return mod === "min" ? "분" : mod === "hr" ? "시" : "일";
}
