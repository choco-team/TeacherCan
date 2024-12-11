import { ref, set } from 'firebase/database';
import { creatId } from '@/utils/createNanoid';
import { firebaseDB } from '@/services/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ asd: 'asd' }, { status: 200 });
}

export async function POST() {
  try {
    const roomId = creatId();
    set(ref(firebaseDB, `musicRooms/${roomId}`), { roomId });
    return NextResponse.json({ roomId }, { status: 200 });
  } catch (error) {
    throw new Error(error.message);
  }
}
