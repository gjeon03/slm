"use client";

import { calcExpiresAt, isExpired } from "@/app/utils/expire";
import { formatToKST } from "@/app/utils/datetime";
import { useCreateLink } from "@/app/hooks/useCreateLink";
import { useDeleteLink } from "@/app/hooks/useDeleteLink";
import { AgeMod, Recent } from "@/app/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import DefaultInput from "@/app/components/default-input";
import { DefaultSelect } from "@/app/components/default-select";
import { Copy } from "feather-icons-react";
import InfoItem from "@/app/components/info-item";
// import { Copy } from "feather-icons";

const LS_KEY = "slm_recent_links";

export default function Page() {
  const [url, setUrl] = useState("");
  const [ageMod, setAgeMod] = useState<AgeMod>("min");
  const [age, setAge] = useState<number>(1);
  const [shortUrl, setShortUrl] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [recent, setRecent] = useState<Recent[]>([]);

  // 개별 필드 에러 상태
  const [urlError, setUrlError] = useState("");
  const [ageError, setAgeError] = useState("");

  const {
    createLink,
    loading,
    error: createError,
    setError,
  } = useCreateLink({
    onSuccess: (item) => setRecent((prev) => [item, ...prev]),
  });

  const { deleteLink } = useDeleteLink({
    onSuccess: (item) =>
      setRecent((prev) => prev.filter((x) => x.id !== item.id)),
  });

  const MAX_BY_MOD: Record<AgeMod, number> = {
    min: 43200, // 30일
    hr: 720, // 30일
    day: 30,
  };

  const getMaxAge = (mod: AgeMod) => {
    return MAX_BY_MOD[mod];
  };

  const onChangeMod = (val: AgeMod) => {
    setAgeMod(val);
  };

  const validateFields = () => {
    let isValid = true;

    // URL 검증
    setUrlError("");
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("URL은 필수입니다.");
      isValid = false;
    } else if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError("http:// 또는 https:// 로 시작해야 합니다.");
      isValid = false;
    }

    // Age 검증 - 30일 제한 체크
    setAgeError("");
    const totalMinutes =
      ageMod === "min" ? age : ageMod === "hr" ? age * 60 : age * 24 * 60;
    const maxMinutes = 30 * 24 * 60; // 30일 = 43,200분

    if (!age || age < 1) {
      setAgeError("1 이상의 숫자를 입력하세요.");
      isValid = false;
    } else if (totalMinutes > maxMinutes) {
      // 각 단위에 맞는 에러 메시지
      let errorMessage = "";
      if (ageMod === "min") {
        errorMessage = "최대 43,200분(30일)까지 가능합니다.";
      } else if (ageMod === "hr") {
        errorMessage = "최대 720시간(30일)까지 가능합니다.";
      } else {
        errorMessage = "최대 30일까지 가능합니다.";
      }
      setAgeError(errorMessage);
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) {
      return;
    }

    try {
      const result = await createLink(url.trim(), age, ageMod);

      setShortUrl(result.shortUrl);
      setQrLink(result.qrLink);
      setCreatedAt(result.createdAt);
      setExpiresOn(result.expiresAt);

      // url/age만 리셋, 단위는 유지
      setUrl("");
      setAge(1);
      // 성공시 에러도 초기화
      setUrlError("");
      setAgeError("");
    } catch {
      console.error("Link creation failed");
    }
  };

  const handleDelete = (item: Recent) => {
    deleteLink(item);
  };

  useEffect(() => {
    // LocalStorage 상태 복원
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Recent[];
        if (Array.isArray(parsed)) setRecent(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // 상태 LocalStorage 저장
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(recent.slice(0, 100)));
    } catch {}
  }, [recent]);

  // const qrPlaceholder = useMemo(
  //   () => (
  //     <div className="w-44 h-44 mx-auto rounded bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center">
  //       <span className="text-xs text-gray-500">QR Preview</span>
  //     </div>
  //   ),
  //   []
  // );

  const ageMax = getMaxAge(ageMod);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto w-full max-w-lg space-y-6 bg-[#F9FAFB] h-full">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow-sm ">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#ffbe6b]" />
            <span className="font-semibold tracking-tight">SLM</span>
          </div>
        </header>

        {/* Body */}
        <div className="px-4 flex flex-col gap-6">
          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="space-y-3">
            <div className="space-y-1 flex flex-col">
              <label className="text-sm text-gray-600" htmlFor="url">
                Enter Long URL
              </label>
              <DefaultInput
                id="url"
                type="url"
                inputMode="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                isError={!!urlError}
                errorMessage={urlError}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600" htmlFor="age">
                Expiration
              </label>
              <div className="flex gap-2">
                <DefaultInput
                  id="age"
                  type="number"
                  min={1}
                  max={ageMax}
                  value={age}
                  onChange={(e) => {
                    const newValue = Number(e.target.value) || 1;
                    setAge(newValue);
                  }}
                  required
                  className="flex-1"
                  isError={!!ageError}
                  errorMessage={ageError}
                />
                <DefaultSelect
                  id="ageMod"
                  value={ageMod}
                  onChange={(e) => onChangeMod(e.target.value as AgeMod)}
                  required
                >
                  <option value="min">min</option>
                  <option value="hr">hr</option>
                  <option value="day">day</option>
                </DefaultSelect>
              </div>
              <p className="text-xs text-gray-500">
                * 총 만료시간은 30일을 초과할 수 없습니다.
              </p>
            </div>

            {createError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {createError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-[#ffddae] font-extrabold text-white py-2.5 shadow hover:bg-[#ffbe6b] disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Link"}
            </button>
          </form>

          {/* Result */}
          <section className="rounded-xl bg-white shadow-sm p-4 md:p-5 space-y-4">
            {qrLink ? (
              <div className="grid place-items-center">
                <Image
                  src={qrLink}
                  alt="QR Code"
                  width={176}
                  height={176}
                  className="w-44 h-44"
                />
              </div>
            ) : (
              <div className="w-44 h-44 mx-auto rounded-xl bg-gradient-to-br from-gray-100 to-gray-300 grid place-items-center">
                <span className="text-xs text-gray-500 font-bold">
                  QR Preview
                </span>
              </div>
            )}
            <div className="space-y-2">
              <InfoItem
                title="Short Link"
                value={shortUrl}
                icon={
                  <button
                    className="cursor-pointer hover:bg-white rounded-b-xl"
                    onClick={() =>
                      shortUrl && navigator.clipboard.writeText(shortUrl)
                    }
                  >
                    <Copy size={15} />
                  </button>
                }
              />
              <InfoItem
                title="Created At"
                value={createdAt ? formatToKST(createdAt, true) : "—"}
              />
              <InfoItem
                title="Expires On"
                value={expiresOn ? formatToKST(expiresOn, true) : "—"}
              />
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-md py-2 border border-gray-200 font-bold cursor-pointer"
                onClick={() => {
                  if (shortUrl) {
                    window.open(shortUrl, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                Open Link
              </button>
              <a
                href={
                  qrLink
                    ? `/api/download-qr?url=${encodeURIComponent(
                        qrLink
                      )}&filename=qr-code-${
                        shortUrl.split("/").pop() || "download"
                      }.png`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border rounded-md py-2 bg-[#ffbe6b] text-white font-bold text-center inline-block leading-8"
                onClick={(e) => {
                  if (!qrLink) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                Save QR
              </a>
            </div>
          </section>

          {/* Recent Links (LocalStorage) */}
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
                  className="rounded-xl border p-3 flex items-center justify-between gap-3"
                >
                  <button
                    className="flex-1 text-left"
                    onClick={() => {
                      setShortUrl(r.shortUrl);
                      setQrLink(r.qrLink || `${r.shortUrl}.qr`);
                      setCreatedAt(r.createdAt);
                      setExpiresOn(r.expiresAt || "");
                    }}
                    title="Preview에서 보기"
                  >
                    <div className="truncate text-sm">{r.longUrl}</div>
                    <div className="mt-0.5 text-xs text-gray-500 flex flex-wrap items-center gap-2">
                      <span className="truncate max-w-[140px] sm:max-w-xs">
                        {r.shortUrl}
                      </span>
                      <span>•</span>
                      <span>Created {formatToKST(r.createdAt, true)}</span>
                      {calcExpiresAt(r) && (
                        <>
                          <span>•</span>
                          <span>
                            Expires {formatToKST(calcExpiresAt(r)!, true)}{" "}
                            {isExpired(r) && "(expired)"}
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                  <div className="flex gap-2 shrink-0">
                    <button
                      className="rounded-lg border px-3 py-1.5 text-sm"
                      onClick={() => navigator.clipboard.writeText(r.shortUrl)}
                    >
                      Copy
                    </button>
                    <button
                      className="rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(r)}
                    >
                      {"Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-gray-400">
            UI Prototype · TailwindCSS · LocalStorage
          </footer>
        </div>
      </div>
    </div>
  );
}
