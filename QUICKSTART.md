# 빠른 시작 가이드 (Quick Start)

## ⚡️ 5분 안에 시작하기

### 1️⃣ 패키지 설치

```bash
pnpm install
```

### 2️⃣ 환경 변수 설정

`.env.local` 파일을 생성하세요 (프로젝트 루트):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

**Supabase 프로젝트가 없다면?**

1. [Supabase](https://supabase.com)에서 무료 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사
3. Settings > Database에서 Connection String 복사

### 3️⃣ 데이터베이스 설정

```bash
# 마이그레이션 생성 및 실행
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

또는 Supabase Dashboard > SQL Editor에서:

- `drizzle/` 폴더의 생성된 `.sql` 파일 내용을 복사하여 실행

### 4️⃣ RLS 정책 설정

Supabase Dashboard > SQL Editor에서 실행:

```bash
# supabase/policies.sql 파일의 내용을 복사하여 SQL Editor에 붙여넣고 실행
```

### 5️⃣ 개발 서버 시작

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 열기

---

## 🎯 첫 사용

### 회원가입

1. http://localhost:3000/signup 방문
2. 이메일과 비밀번호로 가입
3. 이메일 인증 (개발 환경에서는 자동 확인됨)
4. 로그인

### 더미 데이터 추가 (선택)

**방법 1: SQL 직접 실행**

Supabase Dashboard > SQL Editor에서:

```sql
-- 1. Authentication > Users에서 본인의 user_id 복사
-- 2. 아래 YOUR_USER_ID를 실제 user_id로 교체하여 실행

-- 샘플 보유 종목
INSERT INTO holdings (user_id, symbol, name, sector, quantity, avg_cost, expected_dividend_per_share_year)
VALUES
  ('YOUR_USER_ID', 'KOSEF_배당', 'KODEX 배당성장', '국내 ETF', 100, 11250, 450),
  ('YOUR_USER_ID', 'TIGER_미국배당', 'TIGER 미국S&P500', '해외 ETF', 50, 12500, 600);

-- 샘플 배당
INSERT INTO dividends (user_id, symbol, pay_date, gross_amount, withholding_tax, net_amount)
VALUES
  ('YOUR_USER_ID', 'KOSEF_배당', '2024-11-15', 45000, 4500, 40500),
  ('YOUR_USER_ID', 'TIGER_미국배당', '2024-10-20', 30000, 4500, 25500);

-- 샘플 입금
INSERT INTO cash_flows (user_id, date, amount, memo)
VALUES
  ('YOUR_USER_ID', '2024-11-02', 2000000, '11월 정기입금'),
  ('YOUR_USER_ID', '2024-10-02', 2000000, '10월 정기입금');
```

**방법 2: seed.ts 활용**

`src/lib/db/seed.ts` 파일의 `generateSeedSQL()` 함수를 사용하여 전체 샘플 데이터 SQL 생성

---

## 📱 화면 구성

### Week 1 완료 항목 ✅

- ✅ **대시보드** (`/`): KPI 카드 4개 (placeholder)
- ✅ **보유현황** (`/holdings`): 레이아웃 준비
- ✅ **배당내역** (`/dividends`): 레이아웃 준비
- ✅ **입출금** (`/cash`): 레이아웃 준비
- ✅ **데이터 임포트** (`/import`): 레이아웃 준비
- ✅ **설정** (`/settings`): 레이아웃 준비

### Week 2 예정 항목 🚧

- 🚧 CSV 업로드 기능
- 🚧 월별 배당 차트 (Recharts)
- 🚧 배당 달력 히트맵
- 🚧 실제 데이터 연동

---

## 🛠 개발 도구

### 유용한 명령어

```bash
# 개발 서버
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 시작
pnpm start

# 린트 검사
pnpm lint

# Drizzle Studio (DB GUI)
pnpm drizzle-kit studio
```

### 디버깅

- **Supabase 로그**: Dashboard > Logs
- **브라우저 콘솔**: 개발자 도구 (F12)
- **Network 탭**: API 요청/응답 확인

---

## 📚 추가 문서

- 상세 설정: [SETUP.md](./SETUP.md)
- 프로젝트 개요: [README.md](./README.md)
- 전체 계획: PRD (제공된 문서 참조)

---

## ⚠️ 자주 발생하는 문제

### "Invalid API key"

→ `.env.local` 파일 확인 및 개발 서버 재시작

### "relation does not exist"

→ 마이그레이션 실행: `pnpm drizzle-kit migrate`

### RLS 오류

→ `supabase/policies.sql` 다시 실행

### 로그인 후 리다이렉트 안됨

→ 브라우저 쿠키 삭제 후 재시도

---

## 🎉 완료!

모든 설정이 끝났다면 대시보드에서 데이터를 확인하고 Week 2 기능 개발을 시작할 수 있습니다!

문제가 있으면 [SETUP.md](./SETUP.md)의 트러블슈팅 섹션을 참조하세요.
