import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: { videoId: string };
}

async function getVideoTitle(videoId: string) {
  try {
    const queryParams = new URLSearchParams({
      part: 'snippet',
      id: videoId,
      key: process.env.YOUTUBE_DATA_API_KEY,
    }).toString();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${queryParams}`,
    );
    const json = await response.json();
    const result = json.items[0].snippet.title;
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req: NextRequest, { params: { videoId } }: IParams) {
  return NextResponse.json({
    title: await getVideoTitle(videoId),
  });
}
