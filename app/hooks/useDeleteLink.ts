import { Recent } from "@/app/types";

interface UseDeleteLinkOptions {
  onSuccess?: (item: Recent) => void;
}

export function useDeleteLink({ onSuccess }: UseDeleteLinkOptions = {}) {
  const deleteLink = async (item: Recent) => {
    // 무조건 한번 접근을 해야 서버에서 제거되어서 일단 무조건 제거하도록함
    // 만료되었으면 로컬에서만 제거
    // if (isExpired(item)) {
    //   onSuccess?.(item);
    //   return;
    // }

    // 만료 전: 서버 삭제 → 성공 시 로컬에서도 제거
    try {
      const keyword = item.keyword || item.shortUrl.split("/").pop() || "";
      if (!keyword) throw new Error("keyword not found");

      const res = await fetch(`/api/shorten/${encodeURIComponent(keyword)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "delete failed");

      onSuccess?.(item);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "삭제 실패";
      alert(errorMessage);
      throw e;
    }
  };

  return {
    deleteLink,
  };
}
