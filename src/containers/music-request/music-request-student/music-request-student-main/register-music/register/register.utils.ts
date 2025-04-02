export const isValidUrl = (_url: string) => {
  const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
  return pattern.test(_url);
};

export const isYoutubeUrl = (_url: string) => {
  const { hostname } = new URL(_url);
  return hostname === 'youtu.be' || hostname.includes('youtube.com');
};
