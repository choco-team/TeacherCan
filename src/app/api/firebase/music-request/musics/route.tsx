import { ref, set } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const musicData = await req.json();
    set(
      ref(
        firebaseDB,
        `musicRooms/${musicData.roomId}/musics/${musicData.videoId}`,
      ),
      { title: musicData.title, proposer: musicData.proposer },
    );
    return NextResponse.json(
      { message: '성공적으로 저장하였습니다.' },
      { status: 200 },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
