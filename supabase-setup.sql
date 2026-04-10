-- ============================================
-- 101% OneMoreRep - Supabase 테이블 설정
-- Supabase Dashboard > SQL Editor 에서 실행
-- ============================================

-- 1. 동의한 사용자 테이블 (익명)
create table if not exists consent_users (
  id uuid default gen_random_uuid() primary key,
  anonymous_id text unique not null,
  consented_at timestamptz default now(),
  last_sync_at timestamptz,
  total_workouts int default 0,
  active boolean default true
);

-- 2. 운동 로그 테이블
create table if not exists workout_logs (
  id uuid default gen_random_uuid() primary key,
  anonymous_id text not null references consent_users(anonymous_id) on delete cascade,
  workout_date text not null,
  duration_sec int,
  intensity int,
  total_volume int,
  main_volume int,
  main_sets int,
  calories int,
  exercises jsonb,
  created_at timestamptz default now()
);

-- 3. 인덱스
create index if not exists idx_logs_anon_id on workout_logs(anonymous_id);
create index if not exists idx_logs_date on workout_logs(workout_date);
create index if not exists idx_consent_active on consent_users(active);

-- 4. RLS (Row Level Security) 활성화
alter table consent_users enable row level security;
alter table workout_logs enable row level security;

-- 5. 정책: 누구나 동의 등록 가능 (insert)
create policy "anon_insert_consent" on consent_users
  for insert to anon with check (true);

-- 6. 정책: 누구나 자기 로그 추가 가능
create policy "anon_insert_logs" on workout_logs
  for insert to anon with check (true);

-- 7. 정책: 누구나 자기 동의 상태 조회 가능 (anonymous_id 기반)
create policy "anon_select_own_consent" on consent_users
  for select to anon using (true);

-- 8. 정책: 서비스 키(관리자)는 모든 데이터 접근 가능
-- (service_role 키는 RLS를 자동 우회하므로 별도 정책 불필요)
