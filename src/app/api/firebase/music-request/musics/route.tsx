import { get, push, ref, set } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const musicData = await req.json();
    const videoIdRef = ref(
      firebaseDB,
      `musicRooms/${musicData.roomId}/musics/videoIds/${musicData.videoId}`,
    );
    const snapshot = await get(videoIdRef);
    if (snapshot.exists()) {
      return NextResponse.json(
        { message: '이미 신청된 음악입니다.' },
        { status: 409 },
      );
    }
    await set(videoIdRef, true);

    const musicsRef = push(
      ref(firebaseDB, `musicRooms/${musicData.roomId}/musics/list`),
    );

    await set(musicsRef, {
      videoId: musicData.videoId,
      title: musicData.title,
      proposer: musicData.proposer,
    });
    return NextResponse.json(
      { message: '음악 신청이 완료되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
