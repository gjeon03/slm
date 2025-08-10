// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";

const YOURLS_BASE_URL =
  process.env.YOURLS_BASE_URL || "https://slm.kr/yourls-api.php";
const YOURLS_SIGNATURE = process.env.YOURLS_SIGNATURE || "";

type AgeMod = "min" | "hr" | "day";

interface ShortenResponse {
  status?: string; // "success"
  code?: string;
  message?: string;
  errorCode?: string;
  statusCode?: number | string; // 플러그인이 "200"(string) 줄 수 있어서 union
  url?: {
    keyword: string;
    url: string;
    title: string;
    date: string;
    ip: string;
  };
  title?: string;
  shorturl?: string;

  // Expiry 플러그인에서 추가로 올 수 있는 필드
  expiry?: string; // "1 day expiry set."
  expiry_type?: string; // "clock"
  expiry_life?: string; // "86400" (seconds, string)
}

const MAX_SECONDS = 30 * 24 * 60 * 60; // 30 days

function normalizeToSeconds(age: number, mod: "min" | "hr" | "day") {
  if (!Number.isFinite(age) || age <= 0) return 0;
  switch (mod) {
    case "min":
      return age * 60;
    case "hr":
      return age * 60 * 60;
    case "day":
      return age * 24 * 60 * 60;
    default:
      return 0;
  }
}

// YOURLS 응답을 success로 판단 (숫자 200, 문자열 "200", status="success" 모두 허용)
// 플러그인에 따라 statusCode가 string, number 둘 다 오게됨
function isOk(code?: number | string, status?: string) {
  if (status && status.toLowerCase() === "success") return true;
  const n = Number(code);
  return Number.isFinite(n) && n === 200;
}

async function yourlsGet(
  params: Record<string, string>
): Promise<ShortenResponse> {
  const qs = new URLSearchParams({
    signature: YOURLS_SIGNATURE,
    format: "json",
    ...params,
  });
  const res = await fetch(`${YOURLS_BASE_URL}?${qs.toString()}`, {
    cache: "no-store",
  });
  const text = await res.text();
  try {
    const json = JSON.parse(text) as ShortenResponse;
    if (!("statusCode" in json) && !json.statusCode) {
      json.statusCode = res.status;
    }
    return json;
  } catch {
    return {
      status: res.ok ? "success" : "fail",
      statusCode: res.status,
      message: `Non-JSON response: ${text.slice(0, 200)}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, age, ageMod } = body as {
      url?: string;
      age?: number;
      ageMod?: AgeMod;
    };

    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    if (!age || !ageMod) {
      return NextResponse.json(
        { error: "age/ageMod required" },
        { status: 400 }
      );
    }

    const seconds = normalizeToSeconds(Number(age), ageMod);
    if (seconds <= 0) {
      return NextResponse.json({ error: "age must be > 0" }, { status: 400 });
    }
    if (seconds > MAX_SECONDS) {
      // 30일 초과 거부 (분/시간으로 들어와도 동일 기준)
      return NextResponse.json({ error: "max 30 days" }, { status: 400 });
    }

    // 단축 URL 생성
    const createResult = await yourlsGet({
      action: "shorturl",
      url: url,
    });

    if (
      !isOk(createResult.statusCode, createResult.status) ||
      !createResult.url?.keyword
    ) {
      return NextResponse.json(
        { error: createResult.message || "Create failed" },
        { status: 400 }
      );
    }
    const keyword = createResult.url.keyword;

    // 만료일 설정
    const expiryResult = await yourlsGet({
      action: "expiry",
      shorturl: keyword,
      expiry: "clock",
      age: String(age),
      ageMod: String(ageMod),
    });

    if (!isOk(expiryResult.statusCode, expiryResult.status)) {
      // 만료 설정 실패 시 롤백
      const delResult = await yourlsGet({
        action: "delete",
        shorturl: keyword,
      });
      const deleted = isOk(delResult.statusCode, delResult.status);

      const msg = `만료 설정 실패: ${expiryResult.message || "unknown"}${
        deleted ? " (롤백 삭제 완료)" : " (롤백 삭제 실패)"
      }`;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const lifeSec = parseInt(expiryResult.expiry_life || "0", 10);
    let expiresAt: string | undefined;
    if (!isNaN(lifeSec) && lifeSec > 0 && createResult.url?.date) {
      // createResult.url.date가 UTC 형식이 아닐 수 있으므로 UTC로 파싱
      const createdDate = new Date(createResult.url.date + (createResult.url.date.includes('Z') ? '' : 'Z'));
      expiresAt = new Date(
        createdDate.getTime() + lifeSec * 1000
      ).toISOString();
    }

    return NextResponse.json({
      shorturl: createResult.shorturl,
      keyword,
      createdAt: createResult.url.date,
      qrLink: `${createResult.shorturl}.qr`,
      expiresAt,
      expiry: { age, ageMod },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
