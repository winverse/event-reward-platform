# TODO LIST

## 1. Setup (환경 설정)

- [x] Monorepo, turbo, pnpm-workspace 구성
- [x] tsc에서 swc 컴파일러로 변경
- [x] ESM (ES Modules) 지원 설정
- [x] 앱 추가 (Gateway, Auth, Event 서버)
- [x] 타입 검사 추가 (tsc 사용)
- [x] `pnpm lint`, `pnpm format`, `pnpm check-types`, `pnpm dev` 실행 확인
- [x] Express -> Fastify로 변경 및 REST한 API 설계
- [x] `.env` 파일 처리 및 설정
- [x] Docker-Compose를 이용한 MongoDB 환경 구성 및 로컬 데이터 연동
- [x] Database package 생성 (공유 DB 모듈/설정)
- [x] Database Seed 생성

## 2. Core Authentication & Authorization (인증 및 인가 핵심 기능)

- [x] Auth Server 생성 (사용자 관리 및 JWT 발급 기능)
  - [x] 사용자 스키마/엔티티 정의 (MongoDB)
  - [x] 사용자 등록 (회원가입, 권한 설정도 함께) API 구현
  - [x] 로그인 API 구현 (비밀번호 검증, JWT 생성)
  - [x] 역할(Role) 정의 및 변경 가능
- [x] Gateway Server 설정 (인증 및 기본 라우팅)
  - [x] JWT 검증 전략 구현 (`AuthGuard`)
  - [x] Auth Server로의 기본 요청 라우팅/프록시 설정

## 3. Event Management Core (이벤트 관리 핵심 기능)

- [x] Event Server 생성 (핵심 이벤트 및 보상 로직)
  - [x] 이벤트 및 보상 스키마/엔티티 정의 (MongoDB)
  - [x] 이벤트 생성 및 조회 API 구현 (운영자/관리자 역할)
  - [X] 이벤트 보상 등록 / 조회
  - [x] 유저 보상 요청
  - [x] role 별 보상 요청 내역 확인 (본인 or 운영자/감시자/관리자)
- [x] Event Server와 Gateway 연동
  - [x] Gateway에 Event Server API 라우팅 규칙 및 역할 기반 인가(Authorization) 추가

## 4. User Interaction with Events (사용자 이벤트 참여 기능)

- [x] 사용자 보상 요청 및 이력 조회 기능 (Event Server)
  - [x] 사용자 보상 요청 API 구현 (조건 검증, 중복 요청 방지)
  - [x] 사용자/관리자 보상 이력 조회 API 구현
- [x] 사용자 상호작용 API와 Gateway 연동

## 5. Final (마무리)

- [ ] API Documentation
- [x] README.md 개선 (실행 방법, 설계 이유, API 명세 등)
- [ ] Testing
- [ ] API limit (API 호출 제한 - Gateway에서 Rate Limiting)
