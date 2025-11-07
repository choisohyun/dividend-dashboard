# 설정 가이드 (Setup Guide)

이 문서는 배당 대시보드의 초기 설정 방법을 자세히 설명합니다.

## 📋 목차

1. [Supabase 프로젝트 설정](#supabase-프로젝트-설정)
2. [데이터베이스 마이그레이션](#데이터베이스-마이그레이션)
3. [Row Level Security (RLS) 설정](#row-level-security-rls-설정)
4. [로컬 개발 환경](#로컬-개발-환경)
5. [더미 데이터 생성](#더미-데이터-생성)
6. [트러블슈팅](#트러블슈팅)

---

## Supabase 프로젝트 설정

### 1. Supabase 계정 생성

1. [Supabase](https://supabase.com)에 방문하여 계정을 생성합니다
2. "New Project" 버튼을 클릭합니다
3. 프로젝트 정보를 입력합니다:
   - **Name**: dividend-dashboard
   - **Database Password**: 강력한 비밀번호 입력 (저장해두세요!)
   - **Region**: Northeast Asia (Seoul)
   - **Pricing Plan**: Free

### 2. API 키 확인

프로젝트가 생성되면:

1. 좌측 사이드바에서 **Settings** > **API** 선택
2. 다음 정보를 복사합니다:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 데이터베이스 연결 정보

1. **Settings** > **Database** 선택
2. **Connection string** 섹션에서 **URI** 복사
3. `[YOUR-PASSWORD]`를 실제 비밀번호로 교체

---

## 데이터베이스 마이그레이션

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력합니다:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL for Drizzle Migrations
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
```

### 2. 마이그레이션 생성 및 실행

```bash
# 마이그레이션 파일 생성
pnpm drizzle-kit generate

# 마이그레이션 실행
pnpm drizzle-kit migrate
```

또는 Supabase Dashboard에서 직접 실행:

1. Supabase Dashboard > **SQL Editor** 선택
2. `drizzle/` 폴더의 생성된 SQL 파일 내용을 복사
3. SQL Editor에 붙여넣고 **Run** 클릭

---

## Row Level Security (RLS) 설정

Supabase는 Row Level Security를 통해 데이터 접근을 제어합니다.

### 1. RLS 정책 적용

Supabase Dashboard > **SQL Editor**에서 다음 파일의 내용을 실행합니다:

```sql
-- supabase/policies.sql 파일 내용 복사하여 실행
```

### 2. 주요 정책 설명

#### Users 테이블

- 사용자는 자신의 프로필만 조회/수정 가능

#### Holdings, Transactions, Dividends, Cash Flows

- 사용자는 자신의 데이터만 CRUD 가능
- `user_id = auth.uid()` 조건으로 강제

#### Symbol Meta

- 모든 인증된 사용자가 읽기 가능
- 쓰기는 클라이언트에서 불가 (서버/관리자만)

### 3. RLS 활성화 확인

```sql
-- 모든 테이블의 RLS 상태 확인
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

모든 테이블의 `rowsecurity`가 `true`여야 합니다.

---

## 로컬 개발 환경

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

### 3. 빌드 테스트

```bash
pnpm build
pnpm start
```

---

## 더미 데이터 생성

개발/테스트를 위한 샘플 데이터를 생성할 수 있습니다.

### 옵션 1: SQL 스크립트 직접 실행

Supabase SQL Editor에서 실행:

```sql
-- 테스트 사용자 생성 (Supabase Auth를 통해 실제로 가입해야 함)
-- 회원가입 후 user_id를 확인하여 아래에 입력

-- 샘플 보유 종목
INSERT INTO holdings (user_id, symbol, name, sector, quantity, avg_cost, expected_dividend_per_share_year)
VALUES
  ('your-user-id', 'KOSEF_배당', 'KODEX 배당성장', '국내 ETF', 100, 11250, 450),
  ('your-user-id', 'TIGER_미국배당', 'TIGER 미국S&P500', '해외 ETF', 50, 12500, 600),
  ('your-user-id', 'SCHD', 'Schwab US Dividend', '해외 ETF', 30, 28000, 2500);

-- 샘플 배당 내역
INSERT INTO dividends (user_id, symbol, pay_date, gross_amount, withholding_tax, net_amount)
VALUES
  ('your-user-id', 'KOSEF_배당', '2025-01-15', 45000, 4500, 40500),
  ('your-user-id', 'TIGER_미국배당', '2025-02-20', 30000, 4500, 25500),
  ('your-user-id', 'SCHD', '2025-03-25', 75000, 15000, 60000);

-- 샘플 입금 내역
INSERT INTO cash_flows (user_id, date, amount, memo)
VALUES
  ('your-user-id', '2025-01-02', 2000000, '1월 정기입금'),
  ('your-user-id', '2025-02-02', 2000000, '2월 정기입금'),
  ('your-user-id', '2025-03-02', 2000000, '3월 정기입금');

-- 샘플 거래 내역
INSERT INTO transactions (user_id, symbol, trade_date, side, quantity, price, fee_tax)
VALUES
  ('your-user-id', 'KOSEF_배당', '2025-01-05', 'BUY', 100, 11250, 0),
  ('your-user-id', 'TIGER_미국배당', '2025-02-10', 'BUY', 50, 12500, 0),
  ('your-user-id', 'SCHD', '2025-03-15', 'BUY', 30, 28000, 0);
```

### 옵션 2: CSV 임포트 기능 사용

Week 2에서 구현될 CSV 임포트 기능을 사용하여 데이터를 업로드할 수 있습니다.

---

## 트러블슈팅

### 문제 1: "Invalid API key" 오류

**원인**: Supabase API 키가 잘못되었거나 `.env.local` 파일이 없음

**해결**:

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. Supabase Dashboard에서 API 키를 다시 복사
3. 개발 서버 재시작: `pnpm dev`

### 문제 2: "relation does not exist" 오류

**원인**: 데이터베이스 마이그레이션이 실행되지 않음

**해결**:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

또는 Supabase SQL Editor에서 수동으로 마이그레이션 SQL 실행

### 문제 3: RLS 정책으로 인한 접근 거부

**원인**: RLS가 활성화되었지만 정책이 없거나 잘못됨

**해결**:

1. Supabase Dashboard > **Authentication** > **Policies** 확인
2. `supabase/policies.sql` 파일을 다시 실행
3. 테이블별로 정책이 올바르게 설정되었는지 확인

### 문제 4: 로그인 후 리다이렉트되지 않음

**원인**: 미들웨어 설정 또는 세션 문제

**해결**:

1. 브라우저 쿠키 삭제
2. `middleware.ts` 파일 확인
3. Supabase Dashboard > **Authentication** > **URL Configuration**에서 리다이렉트 URL 확인

### 문제 5: Drizzle 마이그레이션 실패

**원인**: DATABASE_URL 형식 오류 또는 네트워크 문제

**해결**:

1. DATABASE_URL 형식 확인:
   ```
   postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
   ```
2. Supabase 프로젝트가 활성 상태인지 확인
3. 방화벽/VPN 설정 확인

---

## 다음 단계

✅ 설정이 완료되면:

1. 회원가입하여 계정 생성
2. 더미 데이터 입력
3. 대시보드에서 데이터 확인
4. Week 2 기능 개발 시작

---

## 추가 리소스

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 문의

문제가 계속 발생하면 GitHub Issues에 보고해주세요.
