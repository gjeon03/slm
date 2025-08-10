import { NextRequest, NextResponse } from "next/server";

const YOURLS_BASE_URL =
  process.env.YOURLS_BASE_URL || "https://slm.kr/yourls-api.php";
const YOURLS_SIGNATURE = process.env.YOURLS_SIGNATURE || "";

interface YourlsRes {
  status?: string;
  statusCode?: number | string;
  message?: string;
}

function isOk(code?: number | string, status?: string) {
  if (status && status.toLowerCase() === "success") return true;
  const n = Number(code);
  return Number.isFinite(n) && n === 200;
}

async function yourlsGet(params: Record<string, string>): Promise<YourlsRes> {
  const qs = new URLSearchParams({
    signature: YOURLS_SIGNATURE,
    format: "json",
    ...params,
  });
  const url = `${YOURLS_BASE_URL}?${qs.toString()}`;
  
  const res = await fetch(url, {
    cache: "no-store",
  });
  const text = await res.text();
  
  try {
    const json = JSON.parse(text) as YourlsRes;
    if (!json.statusCode) json.statusCode = res.status;
    return json;
  } catch {
    return { 
      statusCode: res.status, 
      message: `JSON 파싱 실패: ${text.includes('<!DOCTYPE') ? 'HTML 응답 받음' : '잘못된 JSON'}`
    };
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { keyword: string } }
) {
  const { keyword } = params;
  
  if (!keyword) {
    return NextResponse.json({ error: "keyword required" }, { status: 400 });
  }

  const del = await yourlsGet({ action: "delete", shorturl: keyword });
  
  if (!isOk(del.statusCode, del.status)) {
    return NextResponse.json(
      { error: del.message || "delete failed" },
      { status: 400 }
    );
  }
  
  return NextResponse.json({ ok: true, keyword });
}
