import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * RLS 를 우회하는 관리자용 Supabase 클라이언트.
 *
 * service_role 키는 프로젝트 전체에 대한 마스터 키이므로 절대 클라이언트로 넘어가면 안 된다.
 * - `import 'server-only'` 로 클라이언트 컴포넌트에서 import 하면 빌드가 실패한다.
 * - 조회 결과만 내려보내고, 키나 이 클라이언트를 props 로 전달하지 않는다.
 * - 서비스 롤 키는 .env.local 에만 두고 배포 환경에는 넣지 않는다.
 *
 * supabase.ts 와 마찬가지로 프로젝트별로 클라이언트를 나눈다.
 * 환경변수가 없으면 null 을 반환하므로, 사용하는 쪽에서 확인한 뒤 써야 한다.
 */
const createAdminClient = (url?: string, serviceRoleKey?: string) => {
  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

/** 음악신청 등 기본 프로젝트 */
export const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * 투표 기능은 별도 프로젝트를 사용한다(supabase.ts 의 supabaseVote 참고).
 * 투표 관리자 페이지가 필요해지면 SUPABASE_VOTE_SERVICE_ROLE_KEY 를 추가하고
 * createAdminClient 로 supabaseVoteAdmin 을 만들어 쓴다.
 */
