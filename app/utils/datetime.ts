export function formatToKST(dateStr: string, withTime = false): string {
  let date: Date;
  
  if (dateStr.includes('T')) {
    // ISO 형식 "2025-08-09T21:59:03.000Z"
    date = new Date(dateStr);
  } else {
    // "YYYY-MM-DD HH:mm:ss" 형식도 UTC로 취급
    date = new Date(dateStr + 'Z');
  }
  
  // UTC에서 한국시간(+9시간)으로 변환
  const kstTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
  
  const y = kstTime.getUTCFullYear();
  const m = String(kstTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kstTime.getUTCDate()).padStart(2, "0");
  const dateFormatted = `${y}-${m}-${d}`;
  
  if (!withTime) return dateFormatted;
  
  const h = String(kstTime.getUTCHours()).padStart(2, "0");
  const min = String(kstTime.getUTCMinutes()).padStart(2, "0");
  const sec = String(kstTime.getUTCSeconds()).padStart(2, "0");
  return `${dateFormatted} ${h}:${min}:${sec}`;
}