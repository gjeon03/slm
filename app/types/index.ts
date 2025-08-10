export type AgeMod = "min" | "hr" | "day";

export interface Recent {
  id: string;
  keyword?: string;
  longUrl: string;
  shortUrl: string;
  qrLink?: string;
  createdAt: string; // ISO
  expiresAt?: string; // ISO
  age?: number;
  ageMod?: AgeMod;
}
