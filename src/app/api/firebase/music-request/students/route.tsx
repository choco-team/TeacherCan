import { ref, set } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    set(
      ref(firebaseDB, `musicRooms/${body.roomId}/students/${body.studentName}`),
      nanoid(),
    );
    return NextResponse.json(
      { studentName: body.studentName },
      { status: 200 },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
