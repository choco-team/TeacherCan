import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: { videoID: string };
}

async function getVideoTitle(videoID: string) {
  try {
    const queryParams = new URLSearchParams({
      part: 'snippet',
      id: videoID,
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

export async function GET(req: NextRequest, { params: { videoID } }: IParams) {
  return NextResponse.json({
    title: await getVideoTitle(videoID),
  });
}
