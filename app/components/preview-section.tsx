"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Copy, Check, Trash2 } from "feather-icons-react";
import InfoItem from "@/app/components/info-item";
import { formatToKST } from "@/app/utils/datetime";
import { Recent } from "@/app/types";

interface PreviewSectionProps {
  selectedItem: Recent | null;
  copiedUrl: string;
  handleCopy: (url: string) => void;
  handleDelete: (item: Recent) => void;
}

const PreviewSection = forwardRef<HTMLElement, PreviewSectionProps>(
  ({ selectedItem, copiedUrl, handleCopy, handleDelete }, ref) => {
    return (
      <section
        ref={ref}
        className="rounded-xl bg-white shadow-sm p-4 md:p-5 space-y-4 relative"
      >
        {selectedItem ? (
          <div className="grid place-items-center">
            <Image
              src={selectedItem.qrLink || ""}
              alt="QR Code"
              width={176}
              height={176}
              className="w-44 h-44"
            />
          </div>
        ) : (
          <div className="w-44 h-44 mx-auto rounded-xl bg-gradient-to-br from-gray-100 to-gray-300 grid place-items-center">
            <span className="text-xs text-gray-500 font-bold">QR Preview</span>
          </div>
        )}

        <div className="space-y-2">
          <InfoItem
            title="Long URL"
            value={selectedItem?.longUrl}
            icon={
              <button
                className={`cursor-pointer hover:bg-white rounded-b-xl transition-colors ${
                  copiedUrl === selectedItem?.longUrl ? "text-green-600" : ""
                }`}
                onClick={() =>
                  selectedItem?.longUrl && handleCopy(selectedItem.longUrl)
                }
              >
                {copiedUrl === selectedItem?.longUrl ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            }
          />
          <InfoItem
            title="Short Link"
            value={selectedItem?.shortUrl}
            icon={
              <button
                className={`cursor-pointer hover:bg-white rounded-b-xl transition-colors ${
                  copiedUrl === selectedItem?.shortUrl ? "text-green-600" : ""
                }`}
                onClick={() =>
                  selectedItem?.shortUrl && handleCopy(selectedItem.shortUrl)
                }
              >
                {copiedUrl === selectedItem?.shortUrl ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            }
          />
          <InfoItem
            title="Created At"
            value={
              selectedItem?.createdAt
                ? formatToKST(selectedItem.createdAt, true)
                : "—"
            }
          />
          <InfoItem
            title="Expires On"
            value={
              selectedItem?.expiresAt
                ? formatToKST(selectedItem.expiresAt, true)
                : "—"
            }
          />
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-md py-2 border border-gray-200 font-bold cursor-pointer"
            onClick={() => {
              if (selectedItem?.shortUrl) {
                window.open(
                  selectedItem.shortUrl,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
          >
            Open Link
          </button>
          <a
            href={
              selectedItem?.qrLink
                ? `/api/download-qr?url=${encodeURIComponent(
                    selectedItem.qrLink
                  )}&filename=qr-code-${
                    selectedItem.shortUrl.split("/").pop() || "download"
                  }.png`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border rounded-md py-2 bg-[#F9CE61] text-white font-bold text-center inline-block leading-8"
            onClick={(e) => {
              if (!selectedItem?.qrLink) {
                e.preventDefault();
                return;
              }
            }}
          >
            Save QR
          </a>
        </div>

        {selectedItem && (
          <button
            className="absolute top-2 right-2 rounded-lg p-1.5 text-sm text-red-600 cursor-pointer hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete(selectedItem);
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </section>
    );
  }
);

PreviewSection.displayName = "PreviewSection";

export default PreviewSection;
