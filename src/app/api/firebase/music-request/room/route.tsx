import { get, ref, set } from 'firebase/database';
import { creatId } from '@/utils/createNanoid';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 },
      );
    }
    const roomTitle = await get(
      ref(firebaseDB, `musicRooms/${roomId}/roomTitle`),
    );
    return NextResponse.json({ roomTitle }, { status: 200 });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roomId = creatId();
    set(ref(firebaseDB, `musicRooms/${roomId}`), { roomTitle: body.roomTitle });
    return NextResponse.json({ roomId }, { status: 200 });
  } catch (error) {
    throw new Error(error.message);
  }
}
