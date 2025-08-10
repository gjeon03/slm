import { NextRequest, NextResponse } from "next/server";

const YOURLS_BASE_URL =
  process.env.YOURLS_BASE_URL || "https://slm.kr/yourls-api.php";
const YOURLS_SIGNATURE = process.env.YOURLS_SIGNATURE || "";

interface ShortenResponse {
  status: string;
  code: string;
  message: string;
  errorCode: string;
  statusCode: number;
  url: {
    keyword: string;
    url: string;
    title: string;
    date: string;
    ip: string;
  };
  title: string;
  shorturl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { url, age, ageMod } = body;

    if (!url) {
      console.log("URL이 없음");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 단축 URL 생성
    const createParams = new URLSearchParams({
      signature: YOURLS_SIGNATURE,
      action: "shorturl",
      url: url,
      format: "json",
    });

    const createResponse = await fetch(`${YOURLS_BASE_URL}?${createParams}`);
    const createResult = await createResponse.json();

    if (createResult.statusCode !== 200) {
      return NextResponse.json(
        { error: createResult.message },
        { status: 400 }
      );
    }

    // 만료일 설정
    const expiryParams = new URLSearchParams({
      signature: YOURLS_SIGNATURE,
      action: "expiry",
      shorturl: createResult.url.keyword,
      expiry: "clock",
      age: age.toString(),
      ageMod: ageMod,
      format: "json",
    });

    const expiryResponse = await fetch(`${YOURLS_BASE_URL}?${expiryParams}`);
    const expiryResult = (await expiryResponse.json()) as ShortenResponse;

    if (expiryResult.statusCode !== 200) {
      console.warn(`만료일 설정 실패: ${expiryResult.message}`);
    }

    console.log("단축 URL 생성 성공:", createResult);

    return NextResponse.json({
      shorturl: createResult.shorturl,
      keyword: createResult.url.keyword,
      created: createResult.url.date,
      qrLink: `${createResult.shorturl}.qr`,
      expiry: { age, ageMod },
    });
  } catch (error) {
    console.error("API Error 상세:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
