"use client";

import { useCreateLink } from "@/app/hooks/useCreateLink";
import { useDeleteLink } from "@/app/hooks/useDeleteLink";
import { AgeMod, Recent } from "@/app/types";
import { useEffect, useState, useRef, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LinkForm from "@/app/components/link-form";
import PreviewSection from "@/app/components/preview-section";
import RecentLinks from "@/app/components/recent-links";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import LoadingFallback from "@/app/components/loading-fallback";

const LS_KEY = "slm_recent_links";

function PageContent() {
  const [url, setUrl] = useState("");
  const [ageMod, setAgeMod] = useState<AgeMod>("min");
  const [age, setAge] = useState<number>(1);
  const [recent, setRecent] = useState<Recent[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id") || null;
  const selectedItem = useMemo(
    () => recent.find((r) => r.id === selectedId) || null,
    [recent, selectedId]
  );

  // 개별 필드 에러 상태
  const [urlError, setUrlError] = useState("");
  const [ageError, setAgeError] = useState("");

  const [copiedUrl, setCopiedUrl] = useState("");

  // Preview 영역 참조
  const previewRef = useRef<HTMLElement>(null);

  const {
    createLink,
    loading,
    error: createError,
    setError,
  } = useCreateLink({
    onSuccess: (item) => {
      setRecent((prev) => [item, ...prev]);
      router.replace(`/?id=${encodeURIComponent(item.id)}`, { scroll: false });
    },
  });

  const { deleteLink } = useDeleteLink({
    onSuccess: (item) =>
      setRecent((prev) => prev.filter((x) => x.id !== item.id)),
  });

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
      await createLink(url.trim(), age, ageMod);

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

  const handleDelete = useCallback((item: Recent) => {
    deleteLink(item);
    if (selectedId === item.id) router.replace("/", { scroll: false });
  }, [deleteLink, selectedId, router]);

  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(""), 2000);
  }, []);

  const handleClickItem = useCallback((item: Recent) => {
    router.replace(`/?id=${encodeURIComponent(item.id)}`, { scroll: false });

    // 스크롤
    previewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [router]);

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

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || recent.length === 0) return;

    const found = recent.find((x) => x.id === id);
    if (!found) {
      // id가 로컬에 없으면 URL 정리
      router.replace("/", { scroll: false });
    }
  }, [searchParams, recent, router]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto w-full max-w-lg space-y-6 bg-[#F9FAFB] h-full">
        <Header />

        <div className="px-4 flex flex-col gap-6">
          <LinkForm
            url={url}
            setUrl={setUrl}
            age={age}
            setAge={setAge}
            ageMod={ageMod}
            setAgeMod={setAgeMod}
            urlError={urlError}
            ageError={ageError}
            createError={createError}
            loading={loading}
            onSubmit={onSubmit}
          />

          <PreviewSection
            ref={previewRef}
            selectedItem={selectedItem}
            copiedUrl={copiedUrl}
            handleCopy={handleCopy}
            handleDelete={handleDelete}
          />

          <RecentLinks
            recent={recent}
            selectedId={selectedId}
            copiedUrl={copiedUrl}
            handleClickItem={handleClickItem}
            handleCopy={handleCopy}
          />

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  );
}