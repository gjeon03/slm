# SLM — Simple Link Manager

SLM은 YOURLS를 백엔드로 사용하고, Next.js 프론트엔드에서 간편하게 단축 URL을 생성·관리하는 웹 애플리케이션입니다.
만료일 지정, QR 코드 다운로드, 최근 링크 로컬 저장소 관리 기능을 제공합니다.

## 주요 기능

단축 URL 생성 — URL과 만료 시간(분/시간/일 단위) 지정 가능

QR 코드 생성 — 단축 링크 QR 미리보기 및 PNG 저장

만료일 관리 — 30일 제한, 초과 입력 시 에러 표시

삭제 기능 — 생성한 링크 삭제

## 기술 스택

Frontend: Next.js 14, React, Tailwind CSS

Backend: YOURLS (PHP), MySQL

Infra: Docker Compose, Nginx Proxy Manager (SSL/TLS termination)

배포: Oracle Cloud Infrastructure (OCI)

## 실행 방법

```bash
# 환경 변수 설정

cp .env.example .env

# 개발 서버 실행

pnpm install
pnpm run dev
```

## 배포 및 운영

배포 환경: Oracle Cloud

트래픽 진입점: Nginx Proxy Manager (Docker)

SSL 종료 (Let’s Encrypt 자동 발급/갱신)

다수 도메인 라우팅

보안: YOURLS 및 MySQL은 Private Subnet에 격리

데이터 영속성: Docker Volume을 이용해 DB/NPM 설정·인증서 보존
