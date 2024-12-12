import { ref, set, onValue } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get('roomId');

    onValue(ref(firebaseDB, `musicRooms/${roomId}/musics`), (snapshot) => {
      if (snapshot.exists()) {
        console.log('Real-time data:', snapshot.val());
      } else {
        console.log('No data available');
      }
    });

    return NextResponse.json({ asd: 'asd' }, { status: 200 });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const musicData = await req.json();
    set(
      ref(
        firebaseDB,
        `musicRooms/${musicData.roomId}/musics/${musicData.videoId}`,
      ),
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
