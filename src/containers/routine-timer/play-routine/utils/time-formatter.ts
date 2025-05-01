// 시간 포맷팅
export const formatTime = (timeInSeconds?: number): string => {
  if (timeInSeconds === undefined) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
