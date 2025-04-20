export const getFaviconUrl = (url: string, size = 16) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch (error) {
    return null;
  }
};
