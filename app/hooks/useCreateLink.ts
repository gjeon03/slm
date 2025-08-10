import { useState } from "react";
import { AgeMod, Recent } from "@/app/types";
import { cryptoRandomId } from "@/app/utils/helpers";

interface UseCreateLinkOptions {
  onSuccess?: (link: Recent) => void;
}

export function useCreateLink({ onSuccess }: UseCreateLinkOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createLink = async (url: string, age: number, ageMod: AgeMod) => {
    setLoading(true);
    setError("");

    try {
      const payload = { url, ageMod, age };
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Failed to shorten");

      const code = json.keyword || json.code || json.shorturl?.split("/").pop();
      const short = json.shorturl || `https://slm.kr/${code}`;
      const createdISO =
        json.createdAt ||
        json.created ||
        new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
      const expiresISO = json.expiresAt || "";
      const qr = json.qrLink || `${short}.qr`;

      const item: Recent = {
        id: cryptoRandomId(),
        keyword: code,
        longUrl: url,
        shortUrl: short,
        qrLink: qr,
        createdAt: createdISO,
        expiresAt: expiresISO || undefined,
        age,
        ageMod,
      };

      onSuccess?.(item);
      return {
        id: item.id,
        shortUrl: short,
        qrLink: qr,
        createdAt: createdISO,
        expiresAt: expiresISO,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "요청 중 오류가 발생했습니다.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLink,
    loading,
    error,
    setError,
  };
}
