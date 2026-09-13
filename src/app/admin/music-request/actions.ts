'use server';

import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/utils/supabase-admin';

/**
 * 방 삭제. musics 와 room_secrets 는 FK 의 ON DELETE CASCADE 로 함께 정리된다.
 *
 * 미들웨어가 /admin 을 개발 환경으로 제한하지만, 서버 액션은 별도의 요청이므로
 * 여기서도 한 번 더 확인한다.
 */
export async function deleteRoomAction(formData: FormData) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다.');
  }

  const roomId = String(formData.get('roomId') ?? '');

  if (!roomId) {
    throw new Error('roomId 가 없습니다.');
  }

  const { error } = await supabaseAdmin.from('rooms').delete().eq('id', roomId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/music-request');
}
