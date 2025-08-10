import { Recent } from "@/app/types";

export const calcExpiresAt = (item: Recent): string | undefined => {
  if (item.expiresAt) return item.expiresAt; // 서버가 준 값 우선
  return undefined; // 서버에서 안 준 경우는 무기한
};

export const isExpired = (item: Recent) => {
  const ex = calcExpiresAt(item);
  if (!ex) return false;
  
  // 만료시간을 Date 객체로 변환
  let expiresDate: Date;
  if (ex.includes('T')) {
    // ISO 형식
    expiresDate = new Date(ex);
  } else {
    // "YYYY-MM-DD HH:mm:ss" 형식은 UTC로 취급
    expiresDate = new Date(ex + 'Z');
  }
  
  // 현재 시간과 비교 (둘 다 UTC 기준)
  return new Date() > expiresDate;
};
