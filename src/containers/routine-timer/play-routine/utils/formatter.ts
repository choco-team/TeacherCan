export const formatTime = (time: number | string): string => {
  const timeString = time.toString();
  const [minutes, seconds] = timeString.includes(':')
    ? timeString.split(':')
    : ['0', '00'];
  return `${minutes}:${seconds.padStart(2, '0')}`;
};

export const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
