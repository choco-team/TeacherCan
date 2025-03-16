export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const findNextVideIndex = (
  order: 'next' | 'prev',
  playerType: 'order' | 'shuffle',
  currentVideoIndex: number,
  musicCount: number,
) => {
  if (playerType === 'shuffle') {
    return Math.floor(Math.random() * musicCount);
  }

  if (order === 'next' && currentVideoIndex + 1 === musicCount) {
    return 0;
  }

  if (order === 'next') {
    return currentVideoIndex + 1;
  }

  if (order === 'prev' && currentVideoIndex === 0) {
    return musicCount - 1;
  }

  if (order === 'prev') {
    return currentVideoIndex - 1;
  }

  return 0;
};
