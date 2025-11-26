# 배당 대시보드 (Dividend Dashboard)

개인 배당 투자를 추적하고 분석하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **월별 현금흐름 가시화**: 배당 수령 내역을 월별로 확인
- **목표 달성 추적**: 목표 월 배당(₩900,000) 대비 진행률 모니터링
- **투자 루틴 체크**: 월별 입금 목표(₩2,000,000) 준수율 확인
- **보유 자산 관리**: 종목별 보유 현황 및 섹터 분석
- **CSV 데이터 임포트**: 증권사 거래내역 쉽게 업로드

## 🚀 시작하기

### 필수 조건

- Node.js 20+
- pnpm (또는 npm/yarn)
- Supabase 계정

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd dividend-dashboard
```

2. 의존성 설치
```bash
pnpm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Supabase 프로젝트 정보를 입력하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

4. 데이터베이스 마이그레이션
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Supabase SQL Editor에서 `supabase/policies.sql`을 실행하여 RLS 정책을 설정하세요.

5. 개발 서버 시작
```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🧪 테스트

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# Watch 모드로 테스트
pnpm test

# UI 모드로 테스트
pnpm test:ui

# 커버리지 리포트 생성
pnpm test:coverage
```

### 테스트 커버리지

현재 **100개의 테스트**가 구현되어 있습니다 (100% 통과):

- **계산 로직 테스트** (37개)
  - 배당 계산 (TTM, 월별, 예상)
  - 목표 진행률 계산
  - 루틴 준수율 및 스트릭
  - YOC 계산

- **포맷팅 테스트** (22개)
  - 통화 포맷 (KRW)
  - 날짜 포맷 (Asia/Seoul)
  - 퍼센트, 숫자 포맷

- **CSV 파서 테스트** (19개)
  - CSV 파싱
  - 열 매핑
  - 데이터 검증

- **컴포넌트 테스트** (13개)
  - KpiCard
  - EmptyState
  - UploadProgress

- **통합 테스트** (9개)
  - 리포트 생성 플로우
  - 백업/복원 검증

모든 핵심 비즈니스 로직이 테스트되고 있습니다.

## 📁 프로젝트 구조

```
dividend-dashboard/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── (auth)/            # 인증 페이지 (로그인/회원가입)
│   │   └── (dashboard)/       # 대시보드 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── dashboard/        # 대시보드 컴포넌트
│   │   ├── layout/           # 레이아웃 컴포넌트
│   │   └── ui/               # shadcn/ui 컴포넌트
│   ├── lib/                   # 유틸리티 라이브러리
│   │   ├── auth/             # 인증 헬퍼
│   │   ├── calculations/     # 계산 로직
│   │   ├── db/               # Drizzle ORM 스키마
│   │   ├── format/           # 포맷팅 유틸리티
│   │   ├── providers/        # React Provider
│   │   ├── store/            # Zustand 상태 관리
│   │   └── supabase/         # Supabase 클라이언트
│   ├── hooks/                 # 커스텀 React Hooks
│   └── types/                 # TypeScript 타입 정의
├── drizzle/                   # 데이터베이스 마이그레이션
├── supabase/                  # Supabase 설정 파일
└── public/                    # 정적 파일
```

## 🛠 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **데이터베이스**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **인증**: Supabase Auth
- **상태 관리**: 
  - React Query (서버 상태)
  - Zustand (클라이언트 상태)
- **UI**: 
  - Tailwind CSS
  - shadcn/ui
- **차트**: Recharts
- **테스트**: Vitest + React Testing Library
- **배포**: Vercel

## 📊 데이터 모델

### 주요 테이블

- `users`: 사용자 정보 및 목표 설정
- `holdings`: 현재 보유 종목
- `transactions`: 매수/매도 거래 내역
- `dividends`: 배당 수령 내역
- `cash_flows`: 입출금 내역
- `symbol_meta`: 종목 메타데이터 (섹터, 배당 일정)

자세한 내용은 [SETUP.md](./SETUP.md)를 참조하세요.

## 📥 CSV 임포트 가이드

### 거래내역 (transactions.csv)
```csv
trade_date,symbol,side,quantity,price,fee_tax
2025-01-05,KOSEF_배당,BUY,10,11250,0
```

### 배당내역 (dividends.csv)
```csv
pay_date,symbol,gross_amount,withholding_tax,net_amount
2025-03-15,KOSEF_배당,3400,340,3060
```

### 입금내역 (cash_flows.csv)
```csv
date,amount,memo
2025-01-02,2000000,월 정기입금
```

## 🗓 개발 로드맵

### ✅ Week 1 (Foundation) - 완료
- [x] 데이터베이스 스키마 및 마이그레이션
- [x] 인증 시스템 (로그인/회원가입/이메일 인증)
- [x] 대시보드 레이아웃 (반응형)
- [x] 유틸리티 함수 (계산, 포맷)
- [x] TypeScript 타입 정의

### ✅ Week 2 (Data & Charts) - 완료
- [x] CSV 업로드 기능 (거래/배당/입금)
- [x] 월별 배당 차트 (Recharts)
- [x] 배당 달력 히트맵
- [x] 보유현황 테이블 (정렬, 필터, YOC)
- [x] 배당 내역 테이블 (세전/세후, 피벗)
- [x] 입출금 페이지 (타임라인, 차트, 루틴 트래커)
- [x] 설정 페이지 (목표 수정)
- [x] 91개 유닛 테스트

### ✅ Week 3 (Reports & Integration) - 완료
- [x] 주간/월간 리포트 자동 생성
- [x] 리포트 카드 (복사, 공유, 이미지 저장)
- [x] 리포트 페이지 및 생성 다이얼로그
- [x] 데이터 백업/복원 (JSON)
- [x] 자동 백업 스케줄링 (매주 일요일)
- [x] 데이터 관리 UI (통계, 초기화)
- [x] 온보딩 다이얼로그 (첫 로그인 시)
- [x] 도움말 시스템 (페이지별 가이드)
- [x] 토스트 알림 시스템 (Sonner)
- [x] 통합 테스트 추가
- [x] 구글 시트 연동 준비 (Week 4)

### 📅 Week 4 (Advanced Features) - 진행 중
- [x] 구글 시트 연동 (API 클라이언트, UI, 동기화)
- [x] 자동 백업 스케줄링 (Vercel Cron)
- [ ] 다크 모드
- [ ] 키보드 단축키
- [ ] 성능 최적화

## 🤝 기여하기

이 프로젝트는 개인 프로젝트이지만, 이슈와 제안은 환영합니다!

## 📄 라이선스

MIT License

## 💡 지원

문제가 발생하면 [SETUP.md](./SETUP.md)의 트러블슈팅 섹션을 확인하세요.
