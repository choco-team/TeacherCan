import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: { videoId: string };
}

async function getViedos(videoId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUYUBE_DATA_API_KEY}`,
    );
    const json = await response.json();
    const result = json.items[0].snippet.title;
    return result;
  } catch (e) {
    console.log(e.message);
    return '에러발생';
  }
}

export async function GET(req: NextRequest, { params: { videoId } }: IParams) {
  return NextResponse.json({
    title: await getViedos(videoId),
  });
}
