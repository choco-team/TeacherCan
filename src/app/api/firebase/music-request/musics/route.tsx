import { push, ref, set } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const musicData = await req.json();
    set(push(ref(firebaseDB, `musicRooms/${musicData.roomId}/musics/`)), {
      title: musicData.title,
      proposer: musicData.proposer,
      videoId: musicData.videoId,
    });
    return NextResponse.json(
      { message: '성공적으로 저장하였습니다.' },
      { status: 200 },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
