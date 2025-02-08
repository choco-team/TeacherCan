import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: { videoID: string };
}

async function getVideos(videoID: string) {
  try {
    const queryParams = new URLSearchParams({
      part: 'snippet',
      id: videoID,
      key: process.env.YOUTUBE_DATA_API_KEY,
    });
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${queryParams.toString()}`,
    );
    const json = await res.json();
    const snippet = await json.items[0].snippet;

    queryParams.set('id', snippet.channelId);
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?${queryParams.toString()}`,
    );
    const channelJson = await channelRes.json();

    const result = await {
      publishedAt: snippet.publishedAt.split('T')[0],
      description: snippet.description,
      thumbnails: snippet.thumbnails.high.url,
      channelTitle: snippet.channelTitle,
      channelThumbnails: await channelJson.items[0].snippet.thumbnails.high.url,
    };
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req: NextRequest, { params: { videoID } }: IParams) {
  return NextResponse.json(await getVideos(videoID));
}
