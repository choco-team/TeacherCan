import { ref, set } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ asd: 'asd' }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const musicData = await request.json();
    set(
      ref(firebaseDB, `musicRooms/${musicData.roomId}/${musicData.videoId}`),
      musicData,
    );

    return NextResponse.json(
      { message: '성공적으로 저장하였습니다.' },
      { status: 200 },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
