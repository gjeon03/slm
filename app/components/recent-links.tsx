"use client";

import { memo } from "react";
import { Copy, Check } from "feather-icons-react";
import { formatToKST } from "@/app/utils/datetime";
import { calcExpiresAt } from "@/app/utils/expire";
import { Recent } from "@/app/types";
import { cn } from "@/app/utils/helpers";

interface RecentLinksProps {
  recent: Recent[];
  selectedId: string | null;
  copiedUrl: string;
  handleClickItem: (item: Recent) => void;
  handleCopy: (url: string) => void;
}

const RecentLinks = ({
  recent,
  selectedId,
  copiedUrl,
  handleClickItem,
  handleCopy,
}: RecentLinksProps) => {
  return (
    <section className="space-y-3">
      <h2 className="font-bold">Recent Links</h2>
      <div className="space-y-2">
        {recent.length === 0 && (
          <div className="text-sm text-gray-500">
            아직 생성된 링크가 없습니다.
          </div>
        )}
        {recent.map((r) => (
          <div
            key={r.id}
            className={cn(
              "rounded-xl shadow-md bg-white p-3 flex flex-col gap-3 relative hover:ring-2 hover:ring-[#F9CE61] transition-all duration-200 cursor-pointer",
              {
                "ring-2 ring-[#F9CE61]": selectedId === r.id,
              }
            )}
            onClick={() => handleClickItem(r)}
          >
            <div className="flex gap-1 flex-col truncate text-sm">
              <span>{r.longUrl}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#F9CE61] font-bold">{r.shortUrl}</span>
                <button
                  className={`cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5 transition-colors ${
                    copiedUrl === r.shortUrl
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(r.shortUrl);
                  }}
                >
                  {copiedUrl === r.shortUrl ? (
                    <Check size={12} />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-0.5 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
              <span>Created: {formatToKST(r.createdAt, true)}</span>
              <span>Expires: {formatToKST(calcExpiresAt(r)!, true)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(RecentLinks);
