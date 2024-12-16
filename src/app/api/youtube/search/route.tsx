import { NextRequest, NextResponse } from 'next/server';

async function searchVideos(q: string) {
  try {
    const queryParams = new URLSearchParams({
      key: process.env.YOUTUBE_DATA_API_KEY,
      part: 'snippet',
      type: 'video',
      q,
    }).toString();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${queryParams}`,
    );
    const data = await response.json();
    const result = await data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt.split('T')[0],
      channelTitle: item.snippet.channelTitle,
      isRequested: false,
    }));
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');

  return NextResponse.json(await searchVideos(q));
}
