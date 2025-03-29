const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMusicTitle = async (videoId: string) => {
  const response = await fetch(
    `${originURL}/api/youtube/video/title/${videoId}`,
  );
  const json = await response.json();
  return json.title;
};

export const youtubeSearch = async (q: string) => {
  const response = await fetch(`${originURL}/api/youtube/search?q=${q}`);
  return response.json();
};
