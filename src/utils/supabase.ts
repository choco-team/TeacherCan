import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseVoteUrl = process.env.NEXT_PUBLIC_SUPABASE_VOTE_URL;
const supabaseVoteAnonKey = process.env.NEXT_PUBLIC_SUPABASE_VOTE_ANON_KEY;

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
const hasSupabaseVoteEnv = Boolean(supabaseVoteUrl && supabaseVoteAnonKey);

if (!hasSupabaseVoteEnv) {
  console.warn(
    '[Supabase] NEXT_PUBLIC_SUPABASE_VOTE_URL 또는 NEXT_PUBLIC_SUPABASE_VOTE_ANON_KEY가 설정되지 않았습니다. Supabase 기능이 정상 동작하지 않을 수 있습니다.',
  );
}

if (!hasSupabaseEnv) {
  console.warn(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. Supabase 기능이 정상 동작하지 않을 수 있습니다.',
  );
}

// NOTE: 환경변수가 없는 로컬 개발 환경에서도 앱 전체가 크래시나지 않도록 안전한 기본값을 사용합니다.
// 실제 API 호출은 실패할 수 있으니 .env.local 설정이 필요합니다.
export const supabase = createClient(
  supabaseUrl ?? 'https://example.supabase.co',
  supabaseAnonKey ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder',
);

export const supabaseVote = createClient(
  supabaseVoteUrl ?? 'https://example.supabase.co',
  supabaseVoteAnonKey ??
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder',
);
